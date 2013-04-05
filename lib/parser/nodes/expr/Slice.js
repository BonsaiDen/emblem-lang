var Node = require('../Node');

Node('Slice', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from && this.from.visit(visitor, this, depth + 1, fromTop);
        this.to && this.to.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO might depend on type ??? Only stuff with length and items
        // TODO can be range access be overloaded? Probably should!
        // TODO how to generate overloaded functions? __overload__slice__() ???
        if (this.from && this.to) {
            return '.slice(' + this.from + ', ' + this.to +')';

        } else if (this.from) {
            return '.slice(' + this.from + ')';

        } else if (this.to) {
            return '.slice(0, ' + this.to +')';

        } else {
            return '.slice(' + this.from + ', ' + this.to +')';
        }

    }

});

