var Node = require('../Node');

Node('Op', function(operator, left, right, postfix) {
    this.op = operator;
    this.left = left;
    this.right = right || null;
    this.isInfix = left && right ? true : false;
    this.isUnary = !right;
    this.isPost = !!postfix;

    this.lType = null;
    this.rType = null;

}, {

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.left && this.left.visit(visitor, this, depth + 1, fromTop);
        this.right && this.right.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        if (this.left && this.right) {
            // TODO does this actually work?
            this.setPrimitive(this.left.isPrimitive() && this.right.isPrimitive());

        } else {
            this.setPrimitive(this.left.isPrimitive());
        }

        this.lType = this.left.getType();
        this.rType = this.right ? this.right.getType() : null;

        if (this.isInfix) {
            return this.setType(this.lType.getOpReturn(this.op, this.rType));

        } else if (this.isPost) {
            return this.setType(this.lType.getOpReturn(this.op, null, true));

        } else if (this.isUnary) {
            return this.setType(this.lType.getOpReturn(this.op));
        }

    },

    toString: function() {

        if (this.isInfix) {
            return this.lType.getOpTemplate(this.op, this.rType)(this.left, this.right);

        } else if (this.isPost) {
            return this.lType.getOpTemplate(this.op, null, true)(this.left);

        } else if (this.isUnary) {
            return this.lType.getOpTemplate(this.op)(this.left);
        }

    }

});

