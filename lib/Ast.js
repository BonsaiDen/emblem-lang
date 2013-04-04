var parser = require('./parser');

var Ast = function(source) {
    // TODO add parent?
    this.tree = parser.parse(source);
};

Ast.prototype = {

    generate: function() {
        return this.tree.toString();
    },

    traverse: function(visitor) {
        this.tree.visit(visitor);
    }

};

module.exports = Ast;

