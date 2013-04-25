var Node = require('../Node');

Node('Type', function(name, itemTypes) {
    this.name = name;
    this.itemTypes = itemTypes ? itemTypes : [];

}, {

    // Custom -----------------------------------------------------------------
    isList: function() {
        return this.itemTypes.length === 1;
    },

    isMap: function() {
        return this.itemTypes.length === 2;
    },

    getItem: function() {
        return this.itemTypes[0];
    },

    getKey: function() {
        return this.itemTypes[0];
    },

    getValue: function() {
        return this.itemTypes[1];
    },


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

        return this.setType(this.scope.resolveType(this.name, itemTypes));

    },

    toString: function() {
        return this.scope.resolveTypeName(this.name, this.itemTypes);
    }

});

