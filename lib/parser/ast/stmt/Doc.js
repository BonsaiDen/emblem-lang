var Node = require('../Node');

Node.Statement('Doc', function(text) {
    this.text = text;

}, {

    init: function() {

        // Remove leading block whitespace from doc comments
        var lines = this.text.split('\n').filter(function(l) {
            return l.trim().length !== 0;
        });

        var indent = Math.min.apply(Math, lines.map(function(l) {
            return l.match(/(^\s*)/)[0].length;

        }).filter(function(l) {
            return l !== 0;
        }));

        // Rebuild the doc string without the leading whitespace block
        this.lines = lines.map(function(l) {
            return l.substring(indent);
        });

        return true;

    },

    toString: function() {
        return this.toWrapped(1, this.toLineBlock(2, this.lines, ''), '/*', '*/');
    }

});

