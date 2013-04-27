var Node = require('../Node');

Node('Map', function(items) {
    this.items = items;

}, {

    // Custom -----------------------------------------------------------------
    isEmpty: function() {
        return this.items.length === 0;
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.items, visitor, depth, fromTop);
    },

    init: function() {

        var primitive = true,
            type = null;

        // Figure out the type of the map and if all items match
        // the type of the first entry
        // also check whether the items are all primitives
        for(var i = 0, l = this.items.length; i < l; i++) {

            var item = this.items[i],
                itemType = item.getType();

            if (!item.isPrimitive()) {
                primitive = false;
            }

            if (i === 0 && type === null) {
                type = itemType;

            } else if (type !== itemType) {
                throw new TypeError('Inconsistent types in map: Expected ' + type + ' but got ' + itemType);
            }

        }

        this.setPrimitive(primitive);
        return this.setType(type === null ? this.scope.resolveEmptyType('map') : type);

    },

    toString: function() {
        return this.toWrapped(1, this.toLineBlock(2, this.items, ','), '{', '}');
    }

});

