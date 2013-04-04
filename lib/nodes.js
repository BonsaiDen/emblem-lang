/*jshint evil: true*/
var nodes = {},
    defaults = {

        validate: function() {
            return true;
        },

        type: function() {
            return '<Unknown>';
        },

        visit: function(visitor) {
            visitor(this);
        },

        toString: function() {
            return '<Node ' + this.type + '>';
        }

    };

function AstNode(type, ctor, proto) {

    var node = function AstNode() {
        this.type = type;
        ctor.apply(this, arguments);
    };

    var p = node.prototype = proto || {};
    p.validate = p.validate || defaults.validate;
    p.type = p.type || defaults.type;
    p.visit = p.visit || defaults.visit;
    p.toString = p.toString || defaults.toString;

    nodes[type] = node;

}

module.exports = nodes;


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
    add: function(access) {
        this.access.push(access);
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
});

