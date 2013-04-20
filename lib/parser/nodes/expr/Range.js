var Node = require('../Node');

Node('Range', function(from, to, inclusive) {
    this.from = from;
    this.to = to;
    this.inclusive = !!inclusive;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from.visit(visitor, this, depth + 1, fromTop);
        this.to.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    getType: function() {
        // TODO return list of integers!
        // TODO support single characters lists? a..z
        // TODO uhhh implement the range type?!?!
        return [this.from.getType(), this.to.getType()];
    },

    toString: function() {
        // TODO enforce integers / strings?
        // TODO make use of
        return 'me.integer.range(' + this.from + ', ' + this.to + ')';
    }

});

