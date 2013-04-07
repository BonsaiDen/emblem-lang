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

        var type = this.value.getType();
        for(var i = 0, l = this.access.length; i < l; i++) {

            var access = this.access[i];

            // TODO handle IndexGet and IndexSet in grammar and generate different tokens
            // TODO need to validate assignment here then...
            if (access.id === 'Index') {
                type = type.getIndexGetReturn(access.getType());
                console.log(type);

            // TODO handle RangeGet and RangeSet in grammar and generate different tokens
            } else if (access.id === 'Range') {
                type = type.getIndexGetReturn(access.getType());

            // Member access
            } else {
                // TODO check if the type has a member
            }

        }

        return type;

    },

    toString: function() {
        // TODO handle index and access operations
        if (this.wrapped) {
            return '(' + this.value + ')' + this.access.join('');

        } else {
            return this.value + this.access.join('');
        }
    }

});

