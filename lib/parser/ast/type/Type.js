var Node = require('../Node');

Node('Type', function(name, itemTypes, modifier) {
    this.name = name;
    this.itemTypes = itemTypes ? itemTypes : [];
    this.modifier = modifier || 0;

}, {

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.itemTypes, visitor, depth, fromTop);
    },

    init: function() {

        // We need to pass in the actual types and not the Nodes.
        // While Nodes don't break 99% of the code due to some horrible internals
        // They break the critical 1%
        var itemTypes = new Array(this.itemTypes.length);
        for(var i = 0, l = this.itemTypes.length; i < l; i++) {
            itemTypes[i] = this.itemTypes[i].getType();
        }

        var type = this.scope.resolveType(this.name, itemTypes);
        if (this.modifier) {
            return this.setType(type.withModifiers(this.modifier));

        } else {
            return this.setType(type);
        }

    },

    toString: function() {
        return this.scope.resolveTypeName(this.name, this.itemTypes);
    }

});

