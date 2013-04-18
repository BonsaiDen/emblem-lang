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

        this.errors = [];
        this.warnings = [];
        this.cached = {};

        this._isBlock = !!block;

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
                this.error(e);
            }
            visit.call(this, visitor, parentNode, depth, fromTop);

        } else {
            visit.call(this, visitor, parentNode, depth, fromTop);
            try {
                visitor(this, parentNode, depth, fromTop);

            } catch(e) {
                this.error(e);
            }
        }

    };

    // Wrap Functions to easily track errors ----------------------------------
    function wrap(name, cache) {

        var func = node.prototype[name];
        node.prototype[name] = function() {

            if (cache && this.cached.hasOwnProperty(name)) {
                return this.cached[name];
            }

            try {

                var value = func.apply(this, arguments);
                if (cache) {
                    this.cached[name] = value;
                }

                return value;

            } catch(e) {
                this.error(e);
                // Return a generic object which should prevent further errors
                // due to cascading undefined's
                return {};
            }
        };

    }

    wrap('toString');
    wrap('getType', true);

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
        return false;
    },


    // Per-Node Behavior Implementation  --------------------------------------
    getType: function() {
        return null;
    },

    init: function() {

    },

    visit: function() {
    },

    validate: function() {
        return true;
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

    warning: function(warn) {
        warn.node = this;
        this.warnings.push(warn);
    },

    error: function(err) {
        err.node = this;
        this.errors.push(err);
    }

};

module.exports = AstNode;

