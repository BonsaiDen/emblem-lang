var Node = require('../Node');

Node('List', function(items) {
    this.items = items || [];

}, {

    isEmpty: function() {
        return this.items.length === 0;
    },

    isPrimitive: function() {

        for(var i = 0, l = this.items.length; i < l; i++) {
            if (!this.items[i].isPrimitive()) {
                return false;
            }
        }

        return true;

    },

    getType: function() {

        // TODO Dry with Map version
        var type = null;
        for(var i = 0, l = this.items.length; i < l; i++) {

            var item = this.items[i],
                itemType = item.getType();

            if (type === null) {
                type = itemType;

            } else if (type !== itemType) {
                throw new TypeError('Inconsistent types in list: Expected ' + type + ' but got ' + itemType);
            }

        }

        return type === null ? 'list[]' : type;

    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.items, visitor, depth, fromTop);
    },

    toString: function() {
        return this.toWrapped(1, this.toLineBlock(2, this.items, ','), '[', ']');
    }

});


