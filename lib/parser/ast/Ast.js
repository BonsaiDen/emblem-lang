// Emblem Ast -----------------------------------------------------------------
// ----------------------------------------------------------------------------
var Ast = function(tree, scope) {

    this.type = 'Tree';
    this.parent = null;
    this.scope = scope;

    // Tree might end up being null in case the source is empty
    this.tree = tree;

    // Setup Nodes with additional information
    this.visit(function(node, parent) {
        node.parent = parent;

    }, true);

};

Ast.prototype = {

    findAbove: function(callback, child) {
        var value = callback(this);
        if (value !== undefined && value !== false) {
            return value;
        }
    },

    visit: function(visitor, fromTop) {
        this.tree && this.tree.visit(visitor, this, 0, fromTop);
    },

    validate: function() {

        if (this.tree) {
            return this.tree.validate();

        } else {
            return true;
        }

    },

    toString: function() {
        return this.tree ? this.tree.toString() : '';
    }

};

module.exports = Ast;

