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

        var ft = this.from.getType(),
            tt = this.to.getType();

        if (ft.toString() === 'int' && tt.toString() === 'int') {
            return this.setType(this.scope.resolveTypeName('list', [ft]));

        } else {
            throw new TypeError('Unsupported operands for range: ' + ft + ',' + tt);
        }

    },

    toString: function() {
        return 'em.number.range(' + this.from + ', ' + this.to + ', ' + this.inclusive + ')';
    }

});

