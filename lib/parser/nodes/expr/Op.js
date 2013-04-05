var Node = require('../Node');

Node('Op', function(operator, left, right, postFix) {
    this.op = operator;
    this.left = left;
    this.right = right;
    this.postFix = !!postFix;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.left && this.left.visit(visitor, this, depth + 1, fromTop);
        this.right && this.right.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {

        // TODO requires type checking
        if (this.op === '//') {
            return 'Math.floor(' + this.left + ' / ' + this.right + ')';

        } else if (this.op === '**') {
            return 'Math.pow(' + this.left + ', ' + this.right + ')';

        } else if (this.right) {
            return this.left + ' ' + this.op + ' ' + this.right;

        } else if (this.postFix) {
            return this.left + this.op;

        } else {
            return this.op + this.left;
        }

    }

});

