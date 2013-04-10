function extend(obj, props) {
    for(var p in props) {
        if (props.hasOwnProperty(p)) {
            obj[p] = props[p];
        }
    }
    return obj;
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
    function catchErrorsAndCache(name) {

        var func = node.prototype[name],
            slice = Array.prototype.slice;

        node.prototype[name] = function() {
            try {
                return func.apply(this, arguments);

            } catch(e) {
                this.error(e);
                // Return a generic object which should prevent further errors
                // due to cascading undefined's
                return {};
            }
        };

    }

    catchErrorsAndCache('toString');
    catchErrorsAndCache('getType');

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


    // Per-Node Behavior Implementation  --------------------------------------
    getType: function() {
        return null;
    },

    init: function() {

    },

    visit: function() {
    },

    // TODO do we need this?
    validate: function() {
        return true;
    },

    toString: function() {
        return '<Node ' + this.type + '>';
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

