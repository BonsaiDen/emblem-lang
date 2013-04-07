var Node = require('../Node');

Node('Value', function(value, access, wrapped) {
    this.value = value;
    this.access = access ? [access] : [];
    this.wrapped = wrapped || false;

}, {

    // TODO rename to addAccess or just access
    add: function(access) {
        this.access.push(access);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.access, visitor, depth, fromTop);
    },

    getType: function(assignMode) {

        // TODO implement name lookup for identifier types and this references
        // TODO this references outside class methods need to throw an error
        var type = this.value.getType(),
            access = null,
            lastType = type;

        for(var i = 0, l = this.access.length; i < l; i++) {

            access = this.access[i];
            lastType = type;

            if (access.id === 'Index') {
                type = type.getIndexGetReturn(access.getType());

            } else if (access.id === 'Range') {
                type = type.getRangeGetReturn(access.getType());

            // Member access
            } else {
                // TODO check if the type has a members (structs and classes only)
                // maps are indexed via [] all the time
            }

        }

        if (assignMode) {
            return {
                target: lastType,
                access: access
            };

        } else {
            return type;
        }

    },

    toString: function(assignMode) {

        var value = this.value,
            access = '';

        if (assignMode) {
            access = this.access.slice(0, -1).join('');

        } else {
            access = this.access.join('');
        }

        return this.wrapped ? ('(' + value + ')' + access) : value + access;

    }

});

