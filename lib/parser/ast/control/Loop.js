var Node = require('../Node');

Node.Block('Loop', function(condition, body) {
    this.condition = condition;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.condition && this.condition.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        var condition = this.condition ? this.condition : 'true';
        return this.toWrapped(0, this.body, 'while (' + condition + ') {', '}');
    }

});

