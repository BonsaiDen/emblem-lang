var Node = require('../Node');

Node('Map', function(items) {
    this.items = items;

}, {

    isEmpty: function() {
        return this.items.length === 0;
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

        return type === null ? '*' : type;

    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.items, visitor, depth, fromTop);
    },

    toString: function() {
        return this.toWrapped(1, this.toLineBlock(2, this.items, ','), '{', '}');
    }

});

