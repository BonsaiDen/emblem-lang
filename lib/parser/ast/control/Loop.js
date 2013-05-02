var Node = require('../Node');

Node.Block('Loop', function(condition, body) {
    this.condition = condition || null;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.condition && this.condition.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    }

});

