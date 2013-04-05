var Node = require('../Node');

Node('Bool', function(value) {
    this.value = value === true;

}, {
    toString: function() {
        return this.value ? 'true' : 'false';
    }
});

