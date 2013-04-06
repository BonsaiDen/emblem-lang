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

    getType: function() {
        // TODO handle access and wrapped(?)
        return this.value.getType();
    },

    toString: function() {
        if (this.wrapped) {
            return '(' + this.value + ')' + this.access.join('');

        } else {
            return this.value + this.access.join('');
        }
    }

});

