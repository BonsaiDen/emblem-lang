var Node = require('../Node');

Node('Member', function(name) {
    this.name = name;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.name.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO verify type stuff....
        return true;
    },

    getType: function(targetType, assignType) {

        if (assignType) {
            // TODO handle non-mutable properties
            return null;

        } else if (targetType) {
            return targetType.getPropertyType(this.name.toString(true));
        }

    },

    toString: function(target, targetType, assignType, assign) {

        var t;
        if (assignType) {
            return '<UNIMPLEMENTED PROPERTY ASSIGNMENT>';

        } else {
            t = targetType.getPropertyGetTemplate(this.name.toString(true));
            return t(target, this.scope.mapMemberName(this.name.toString(true)));
        }

    }

});

