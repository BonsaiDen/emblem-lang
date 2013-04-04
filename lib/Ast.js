var parser = require('./parser');

var Ast = function(source) {

    this.type = 'Tree';
    this.parent = null;
    this.tree = parser.parse(source);

    // Setup Nodes with additional information
    this.visit(function(node, parent) {
        node.parent = parent;

    }, true);

};

Ast.prototype = {

    visit: function(visitor, fromTop) {
        this.tree.visit(visitor, this, 0, fromTop);
    },

    toString: function() {
        return this.tree.toString();
    }

};

module.exports = Ast;

