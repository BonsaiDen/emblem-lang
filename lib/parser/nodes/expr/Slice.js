var Node = require('../Node');

Node('Slice', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from && this.from.visit(visitor, this, depth + 1, fromTop);
        this.to && this.to.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function(targetType, assignType) {

        // Indexes default to integers
        var fromType = this.from ? this.from.getType() : 'int',
            toType = this.to ? this.to.getType() : 'int';

        if (assignType) {
            return targetType.getSliceSetReturn(fromType, toType, assignType);

        } else if (targetType) {
            return targetType.getSliceGetReturn(fromType, toType);
        }

    },

    toString: function(targetTmpl, targetType, assignType, assignTmpl) {

        // Indexes default to integers
        var fromType = this.from ? this.from.getType() : 'int',
            toType = this.to ? this.to.getType() : 'int',
            fromTmpl = this.from ? this.from.toString() : '0',
            toTmpl = this.to ? this.to.toString() : '0',
            t;

        if (assignType) {
            t = targetType.getSliceSetTemplate(fromType, toType, assignType);
            return t(targetTmpl, fromTmpl, toTmpl, assignTmpl);

        } else if (targetType) {
            t = targetType.getSliceGetTemplate(fromType, toType);
            return t(targetTmpl, fromTmpl, toTmpl);
        }

    }

});

