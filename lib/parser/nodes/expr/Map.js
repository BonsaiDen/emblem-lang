var Node = require('../Node');

Node('Map', function(items) {
    this.items = items;

}, {

    // Custom -----------------------------------------------------------------
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


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.items, visitor, depth, fromTop);
    },

    init: function() {
        return true;
    },

    getType: function() {

        var type = null;
        for(var i = 0, l = this.items.length; i < l; i++) {

            var item = this.items[i],
                itemType = item.getType();

            if (type === null) {
                type = itemType;

            } else if (type !== itemType) {
                throw new TypeError('Inconsistent types in map: Expected ' + type + ' but got ' + itemType);
            }

        }

        return type === null ? 'map[]' : type;

    },

    toString: function() {
        return this.toWrapped(1, this.toLineBlock(2, this.items, ','), '{', '}');
    }

});

