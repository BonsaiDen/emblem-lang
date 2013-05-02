var Node = require('../Node');

Node.Block('Elif', function(condition, body) {
    this.condition = condition;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.condition.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        var bool = this.scope.resolveType('bool');
        if (this.condition.getType() !== bool) {
            throw new TypeError('expression of elif statment must be boolean');

        } else {
            return true;
        }

    },

    toString: function() {
        return this.toWrapped(0, this.body, ' else if (' + this.condition + ') {', '}');
    }

});

