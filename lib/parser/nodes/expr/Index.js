var Node = require('../Node');

Node('Index', function(key) {
    this.key = key;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function(targetType, assignType) {

        var keyType = this.key.getType();
        if (assignType) {
            return targetType.getIndexSetReturn(keyType, assignType);

        } else if (targetType) {
            return targetType.getIndexGetReturn(keyType);
        }

        //return this.key.getType();
    },

    toString: function(targetTmpl, targetType, assignType, assignTmpl) {

        var keyType = this.key.getType(),
            t;

        if (assignType) {
            t = targetType.getIndexSetTemplate(keyType, assignType);
            return t(targetTmpl, this.key, assignTmpl);

        } else {
            t = targetType.getIndexGetTemplate(keyType);
            return t(targetTmpl, this.key);
        }

        //return assignMode ? this.key : ('[' + this.key + ']') ;

    }

});

