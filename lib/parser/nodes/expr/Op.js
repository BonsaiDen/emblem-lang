var Node = require('../Node');

Node('Op', function(operator, left, right, postfix) {
    this.op = operator;
    this.left = left;
    this.right = right || null;
    this.isInfix = left && right ? true : false;
    this.isUnary = !right;
    this.isPost = !!postfix;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.left && this.left.visit(visitor, this, depth + 1, fromTop);
        this.right && this.right.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function() {

        var lt = this.left.getType();
        if (this.isInfix) {
            return lt.getOpReturn(this.op, this.right.getType());

        } else if (this.isPost) {
            return lt.getOpReturn(this.op, null, true);

        } else if (this.isUnary) {
            return lt.getOpReturn(this.op);
        }

    },

    toString: function() {

        var lt = this.left.getType();
        if (this.isInfix) {
            return lt.getOpTemplate(this.op, this.right.getType())(this.left, this.right);

        } else if (this.isPost) {
            return lt.getOpTemplate(this.op, null, true)(this.left);

        } else if (this.isUnary) {
            return lt.getOpTemplate(this.op)(this.left);
        }

    }

});

