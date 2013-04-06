var Node = require('../Node');

Node('Float', function(value) {
    this.value = +value;

}, {

    getType: function() {
        return this.scope.resolveType('float');
    },

    toString: function() {
        return '' + this.value;
    }

});

