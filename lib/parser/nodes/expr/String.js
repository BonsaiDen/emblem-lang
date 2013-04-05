var Node = require('../Node');

Node('String', function(value) {
    this.value = eval(value);

}, {
    toString: function() {
        return "'" + this.value.replace(/'/g, "\\'") + "'";
    }
});

