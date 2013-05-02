var Node = require('../Node');

Node('Index', function(key) {
    this.key = key;

    this.keyType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        this.keyType = this.key.getType();
        return true;
    },

    getType: function(targetType, assignType) {

        // TODO caching?
        if (assignType) {
            return targetType.getIndexSetReturn(this.keyType, assignType);

        } else if (targetType) {
            return targetType.getIndexGetReturn(this.keyType);
        }

    },

    toString: function(target, targetType, assignType, assign) {

        var t;
        if (assignType) {
            t = targetType.getIndexSetTemplate(this.keyType, assignType);
            return t(target, this.key, assign);

        } else {
            t = targetType.getIndexGetTemplate(this.keyType);
            return t(target, this.key);
        }

    }

});

