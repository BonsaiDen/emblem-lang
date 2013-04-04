/*jshint evil: true*/
var nodeTypes = {};

function extend(obj, props) {
    for(var p in props) {
        if (props.hasOwnProperty(p)) {
            obj[p] = props[p];
        }
    }
    return obj;
}

function AstNode(type, ctor, proto) {

    var node = function AstNode() {
        this.type = type;
        this.parent = null;
        ctor.apply(this, arguments);
    };

    // Setup the prototype of the new Node with some defaults
    // and the custom implementation
    node.prototype = extend({}, AstNode.prototype);
    extend(node.prototype, proto);

    // We wrap the visit function to reduce a lot of the code
    // that handles the traversal order of the tree
    var implementedVisit = node.prototype.visit;
    node.prototype.visit = function(visitor, parentNode, depth, fromTop) {

        if (fromTop) {
            visitor(this, parentNode, depth, fromTop);
            implementedVisit.call(this, visitor, parentNode, depth, fromTop);

        } else {
            implementedVisit.call(this, visitor, parentNode, depth, fromTop);
            visitor(this, parentNode, depth, fromTop);
        }

    };

    nodeTypes[type] = node;

}

AstNode.prototype = {

    validate: function() {
        return true;
    },

    type: function() {
        return '<Unknown>';
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        //visitor(this, parentNode, depth, fromTop);
    },

    visitChildren: function(children, visitor, depth, fromTop) {
        var that = this;
        children.forEach(function(child) {
            child.visit(visitor, that, depth + 1, fromTop);
        });
    },

    toString: function() {
        return '<Node ' + this.type + '>';
    }

};

module.exports = nodeTypes;


// Literals and Identifiers ---------------------------------------------------
// ----------------------------------------------------------------------------
AstNode('Identifier', function(name) {
    this.name = name;

}, {
    toString: function() {
        return '' + this.name;
    }
});


AstNode('Integer', function(value) {
    this.value = +value;

}, {
    toString: function() {
        return '' + this.value;
    }
});


AstNode('Float', function(value) {
    this.value = +value;

}, {
    toString: function() {
        return '' + this.value;
    }
});


AstNode('Bool', function(value) {
    this.value = value === true;

}, {
    toString: function() {
        return this.value ? 'true' : 'false';
    }
});


AstNode('String', function(value) {
    this.value = eval(value);

}, {
    toString: function() {
        return "'" + this.value.replace(/'/g, "\\'") + "'";
    }
});


// Encapsulated Values --------------------------------------------------------
// ----------------------------------------------------------------------------
AstNode('Value', function(value, access, wrapped) {
    this.value = value;
    this.access = access ? [access] : [];
    this.wrapped = wrapped || false;

}, {

    // TODO rename to addAccess or just access
    add: function(access) {
        this.access.push(access);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.access, visitor, depth, fromTop);
    },

    toString: function() {
        if (this.wrapped) {
            return '(' + this.value + ')' + this.access.join('');

        } else {
            return this.value + this.access.join('');
        }
    }

});

AstNode('Access', function(property) {
    this.property = property;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.property.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return '.' + this.property;
    }

});

AstNode('Index', function(key) {
    this.key = key;

}, {
    toString: function() {
        return '[' + this.key + ']';
    }
});


// Operations and Assignments -------------------------------------------------
// ----------------------------------------------------------------------------
AstNode('Op', function(operator, left, right, postFix) {
    this.op = operator;
    this.left = left;
    this.right = right;
    this.postFix = !!postFix;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.left && this.left.visit(visitor, this, depth + 1, fromTop);
        this.right && this.right.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {

        // TODO requires type checking
        if (this.op === '//') {
            return 'Math.floor(' + this.left + ' / ' + this.right + ')';

        } else if (this.op === '**') {
            return 'Math.pow(' + this.left + ', ' + this.right + ')';

        } else if (this.right) {
            return this.left + ' ' + this.op + ' ' + this.right;

        } else if (this.postFix) {
            return this.left + this.op;

        } else {
            return this.op + this.left;
        }

    }

});

AstNode('Assign', function(target, expr, operator) {
    this.target = target;
    this.expression = expr;
    this.op = operator ? operator : '=';

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        if (this.operator === '=') {
            return this.target + ' = ' + this.expression;

        } else {
            return this.target + ' ' + this.op + '= ' + this.expression;
        }
    }

});

AstNode('Call', function(target, args) {
    this.target = target;
    this.args = args;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.args, visitor, depth, fromTop);
    },

    toString: function() {
        return this.target + '(' + this.args.join(', ') + ')';
    }

});

AstNode('This', function() {}, {
    toString: function() {
        return 'this';
    }
});


// Ranges / Slices ------------------------------------------------------------
// ----------------------------------------------------------------------------
AstNode('Range', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from.visit(visitor, this, depth + 1, fromTop);
        this.to.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO both operands must be integers
        // TODO if the values are plain (e.g. can be calculated at compile time, just insert the literals)
        // TODO move this out into a run time helper
        return '(function() {'
                + 'var from = ' + this.from + ';'
                + 'var to = ' + this.to + ';'
                + 'for(var i = from; i < to; i++) { list.push(i); } return list;})';
    }

});

AstNode('Slice', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from && this.from.visit(visitor, this, depth + 1, fromTop);
        this.to && this.to.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO might depend on type ??? Only stuff with length and items
        // TODO can be range access be overloaded? Probably should!
        // TODO how to generate overloaded functions? __overload__slice__() ???
        if (this.from && this.to) {
            return '.slice(' + this.from + ', ' + this.to +')';

        } else if (this.from) {
            return '.slice(' + this.from + ')';

        } else if (this.to) {
            return '.slice(0, ' + this.to +')';

        } else {
            return '.slice(' + this.from + ', ' + this.to +')';
        }

    }

});

AstNode('Splat', function(expr) {
    // TODO how to stringify this? Needs to be joined with ',' and implanted into arguments list
    this.expression = expr;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expression.visit(visitor, this, depth + 1, fromTop);
    }

});

