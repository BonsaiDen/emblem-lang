function extend(obj, props) {
    for(var p in props) {
        if (props.hasOwnProperty(p)) {
            obj[p] = props[p];
        }
    }
    return obj;
}

function level(depth) {
    return new Array(depth + 1).join('    ').substring(4);
}


// Emblem AST Base Node -------------------------------------------------------
// ----------------------------------------------------------------------------
function AstNode(id, ctor, proto, statement, block) {

    var node = function AstNode() {

        var args = Array.prototype.slice.call(arguments);

        this.id = id;
        this.parent = null;
        this.scope = null;
        this.line = [args[0].first_line, args[0].last_line];
        this.col = [args[0].first_column, args[0].last_column];

        this._errors = [];
        this._warnings = [];

        this._type = null;
        this._string = [null, null];
        this._isBlock = !!block;
        this._isInitiated = false;

        this._isPrimitive = false;
        this._isStatement = !!statement;
        this._isExpression = !statement;

        ctor.apply(this, args.slice(1));

    };

    // Setup the prototype of the new Node with some defaults
    // and the custom implementation
    node.prototype = extend({}, AstNode.prototype);
    extend(node.prototype, proto);

    // We wrap the visit function to reduce a lot of the code
    // that handles the traversal order of the tree
    var visit = node.prototype.visit;
    node.prototype.visit = function(visitor, parentNode, depth, fromTop) {

        if (fromTop) {
            try {
                visitor(this, parentNode, depth, fromTop);

            } catch(e) {
                this.addError(e);
            }
            visit.call(this, visitor, parentNode, depth, fromTop);

        } else {
            visit.call(this, visitor, parentNode, depth, fromTop);
            try {
                visitor(this, parentNode, depth, fromTop);

            } catch(e) {
                this.addError(e);
            }
        }

    };

    // Wrap init functions to only be called once
    var init = node.prototype.init;
    node.prototype.init = function() {

        if (!this._isInitiated) {
            this._isInitiated = true;

            try {
                return init.call(this);

            } catch(e) {
                this.addError(e);
                return false;
            }

        } else {
            return true;
        }

    };

    // Wrap get type to call init if it's required
    var getType = node.prototype.getType;
    node.prototype.getType = function() {

        if (!this._isInitiated) {
            this.init();
        }

        try {
            return getType.apply(this, arguments);

        } catch(e) {
            this.addError(e);
            return null;
        }

    };

    // Wrap toString to handle errors------------------------------------------
    var toString = node.prototype.toString;
    node.prototype.toString = function() {

        try {
            return toString.apply(this, arguments);

        } catch(e) {
            this.addError(e);
            return '<' + this.id + ': Failed to generate>';
        }

    };

    AstNode.map[id] = node;
    return node;

}

AstNode.Statement = function(id, ctor, proto) {
    return AstNode(id, ctor, proto, true, false);
};

AstNode.Block = function(id, ctor, proto) {
    return AstNode(id, ctor, proto, true, true);
};


AstNode.map = {};

AstNode.prototype = {

    // AST Helpers ------------------------------------------------------------
    isBlock: function() {
        return this._isBlock;
    },

    isStatement: function() {
        return this._isStatement;
    },

    isExpression: function() {
        return this._isExpression;
    },

    isPrimitive: function() {
        return this._isPrimitive;
    },

    setPrimitive: function() {
        this._isPrimitive = true;
    },

    getType: function() {
        return this._type;
    },

    setType: function(type) {

        if (!type) {
            throw new TypeError('Invalid type set for Node' + this.id + '.');

        } else if (this._type) {
            throw new TypeError('Node ' + this.id + ' already has a type set.');

        } else {
            this._type = type;
            return true;
        }

    },


    // Per-Node Behavior Implementation  --------------------------------------
    init: function() {
        return false;
    },

    visit: function() {
        return;
    },

    toString: function() {
        return '<Node ' + this.type + '>';
    },


    // Code Generation Helpers ------------------------------------------------
    toLine: function(indent, line) {
        indent = level(this.scope.depth + (indent || 0));
        return indent + line;
    },

    toLineBlock: function(indent, lines, join) {
        indent = level(this.scope.depth + (indent || 0));
        join = join || '';
        return indent + lines.join(join + '\n' + indent);
    },

    toWrapped: function(indent, body, begin, end) {
        indent = level(this.scope.depth + (indent || 0));
        begin = begin || '';
        end = end || '';
        return begin + '\n' + body + '\n' + indent + end;
    },


    // Helpers ----------------------------------------------------------------
    findAbove: function(callback, child) {

        var value = callback(this, child);
        if (value !== undefined && value !== false) {
            return value;

        } else {
            return this.parent && this.parent.findAbove(callback, this);
        }

    },

    visitChildren: function(children, visitor, depth, fromTop) {
        var that = this;
        children.forEach(function(child) {
            child.visit(visitor, that, depth + 1, fromTop);
        });
    },


    // Errors and Warnings ----------------------------------------------------
    addWarning: function(warn) {
        warn.node = this;
        this._warnings.push(warn);
    },

    addError: function(err) {
        err.node = this;
        this._errors.push(err);
    },

    getWarnings: function() {
        var warnings = this._warnings.slice();
        this._warnings.length = 0;
        return warnings;
    },

    getErrors: function() {
        var errors = this._errors.slice();
        this._errors.length = 0;
        return errors;
    }

};

module.exports = AstNode;

