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
            type = access.getType(type);
        }

        if (assignMode) {
            return {
                // TODO handle constants
                target: lastType,
                access: access
            };

        } else {
            return type;
        }

    },

    toString: function(assignMode) {

        var value = this.value,
            type = this.value.getType(),
            tmpl = '';

        for(var i = 0, l = this.access.length; i < l; i++) {

            var access = this.access[i];

            // Skip the last block in assign mode
            // the assign node will handle the indexSet template
            if (assignMode && i === l -1) {
                break;

            } else {
                tmpl = access.toString(tmpl, type);
                type = access.getType(type);
                // TODO handle member / property access
            }

        }

        return this.wrapped ? ('(' + value + ')' + tmpl) : value + tmpl;

    }

});

