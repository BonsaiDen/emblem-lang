var Node = require('../Node');

Node('Integer', function(value) {
    this.value = +value;

}, {

    init: function() {
        this.type = this.scope.resolveType('int');
    },

    toString: function() {
        return '' + this.value;
    }

});

