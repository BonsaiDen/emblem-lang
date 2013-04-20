var Node = require('../Node');

Node('Index', function(key) {
    this.key = key;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true; // TODO howto take care of all the targets / assignments
    },

    getType: function(targetType, assignType) {

        var keyType = this.key.getType();
        if (assignType) {
            return targetType.getIndexSetReturn(keyType, assignType);

        } else if (targetType) {
            return targetType.getIndexGetReturn(keyType);
        }

    },

    toString: function(target, targetType, assignType, assign) {

        var keyType = this.key.getType(),
            t;

        if (assignType) {
            t = targetType.getIndexSetTemplate(keyType, assignType);
            return t(target, this.key, assign);

        } else {
            t = targetType.getIndexGetTemplate(keyType);
            return t(target, this.key);
        }

    }

});

