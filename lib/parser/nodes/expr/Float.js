var Node = require('../Node');

Node('Float', function(value) {
    this.value = +value;

}, {
    toString: function() {
        return '' + this.value;
    }
});

