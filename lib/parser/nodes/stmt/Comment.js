var Node = require('../Node');

Node.Statement('Comment', function(text, doc) {

    this.isDoc = doc || false;

    if (this.isDoc) {

        // Remove leading block whitespace from doc comments
        var lines = text.split('\n').filter(function(l) {
            return l.trim().length !== 0;
        });

        var indent = Math.min.apply(Math, lines.map(function(l) {
            return l.match(/(^\s*)/)[0].length;

        }).filter(function(l) {
            return l !== 0;
        }));

        // Rebuild the doc string without the leading whitespace block
        this.text = lines.map(function(l) {
            return l.substring(indent);

        }).join('\n');

    } else {
        this.text = text.trim();
    }

}, {

    isDocBlock: function() {
        return this.isDoc;
    },

    toString: function() {
        if (this.isDoc) {
            return '';

        } else {
            return '// ' + this.text;
        }
    }

});


