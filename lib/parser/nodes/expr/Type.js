var Node = require('../Node');

Node('Type', function(name, itemTypes) {
    this.name = name;
    this.itemTypes = itemTypes ? itemTypes : [];

}, {

    getType: function() {
        return this.scope.resolveType(this.name, this.itemTypes);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.itemTypes, visitor, depth, fromTop);
    },

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

    toString: function() {
        return this.scope.resolveTypeNameFromNode(this);
    }

});

