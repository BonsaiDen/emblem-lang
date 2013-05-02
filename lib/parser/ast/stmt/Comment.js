var Node = require('../Node');

Node.Statement('Comment', function(text) {
    this.text = text;

}, {

    init: function() {
        this.text = this.text.trim();
        return true;
    },

    toString: function() {
        return '// ' + this.text;
    }

});

