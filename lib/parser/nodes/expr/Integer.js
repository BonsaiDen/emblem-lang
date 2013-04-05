var Node = require('../Node');

Node('Integer', function(value) {
    this.value = +value;

}, {
    toString: function() {
        return '' + this.value;
    }
});

