var Node = require('../Node');

Node('Value', function(value, access, wrapped) {
    this.value = value;
    this.access = access ? [access] : [];
    this.wrapped = wrapped || false;

}, {

    access: function(access) {
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

        var type = this.value.getType(),
            tmpl = this.value.toString();

        if (this.wrapped) {
            tmpl = '(' + tmpl + ')';
        }

        for(var i = 0, l = this.access.length; i < l; i++) {

            // Skip the last block in assign mode
            // the assign node will handle the access returns / templates
            if (assignMode && i === l -1) {
                break;

            } else {
                var access = this.access[i];
                tmpl = access.toString(tmpl, type);
                type = access.getType(type);
            }

            // TODO handle member / property access

        }

        return tmpl;

    }

});

