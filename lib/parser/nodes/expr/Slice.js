var Node = require('../Node');

Node('Slice', function(from, to) {
    this.from = from;
    this.to = to;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.from && this.from.visit(visitor, this, depth + 1, fromTop);
        this.to && this.to.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
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

    toString: function(target, targetType, assignType, assign) {

        // Indexes default to integers
        var fromType = this.from ? this.from.getType() : 'int',
            toType = this.to ? this.to.getType() : targetType.getOpReturn('#'),
            from = this.from ? this.from.toString() : '0',

            // TODO this will not be side-effect free on long expressions
            // we need to figure out a way to uh, create a helper function
            // and move out the call there?
            to = this.to ? this.to.toString() : targetType.getOpTemplate('#')(target),
            t;

        if (assignType) {
            t = targetType.getSliceSetTemplate(fromType, toType, assignType);
            return t(target, from, to, assign);

        } else if (targetType) {
            t = targetType.getSliceGetTemplate(fromType, toType);
            return t(target, from, to);
        }

    }

});

