var Node = require('../Node');

Node('Value', function(value, access, wrapped) {
    this.value = value;
    this.access = access ? [access] : [];
    this.wrapped = wrapped || false;

    this.vType = null;
    this.rType = null;
    this.aType = null;

}, {

    // Custom -----------------------------------------------------------------
    addAccess: function(access) {
        this.access.push(access);
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.access, visitor, depth, fromTop);
    },

    init: function() {

        this.vType = this.value.getType();

        var type = this.vType,
            accessor = null,
            lastType = type;

        for(var i = 0, l = this.access.length; i < l; i++) {
            accessor = this.access[i];
            lastType = type;
            type = accessor.getType(type);
        }

        this.rType = type;
        this.aType = {
            target: lastType,
            access: accessor
        };

        this.setPrimitive(this.access.length === 0 && this.value.isPrimitive());
        return true;

    },

    getType: function(assignMode) {
        return assignMode ? this.aType : this.rType;
    },

    toString: function(assignMode) {

        var type = this.vType,
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
                var accessor = this.access[i];
                tmpl = accessor.toString(tmpl, type);
                type = accessor.getType(type);
            }

            // TODO handle member / property access
            // handled in the above implementations specific to
            // Index, Slice, etc. already? :)

        }

        return tmpl;

    }

});

