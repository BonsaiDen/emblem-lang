var Node = require('../Node');

Node('Call', function(target, args) {
    this.target = target;
    this.args = args;

}, {

    getType: function() {
        // Check if target is callable
        // check for overloaded stuff on classes
        // check required / defaulted params
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.args, visitor, depth, fromTop);
    },

    toString: function() {
        return this.target + '(' + this.args.join(', ') + ')';
    }

});

