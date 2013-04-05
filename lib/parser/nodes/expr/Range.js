var Node = require('../Node');

Node('Range', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from.visit(visitor, this, depth + 1, fromTop);
        this.to.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO both operands must be integers
        // TODO if the values are plain (e.g. can be calculated at compile time, just insert the literals)
        // TODO move this out into a run time helper
        return '(function() {'
                + 'var from = ' + this.from + ';'
                + 'var to = ' + this.to + ';'
                + 'for(var i = from; i < to; i++) { list.push(i); } return list;})';
    }

});

