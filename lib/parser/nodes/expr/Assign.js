var Node = require('../Node');

Node('Assign', function(target, expr, operator) {
    this.target = target;
    this.expression = expr;
    this.op = operator ? operator : '=';

    this.eType = null;
    this.aType = null;
    this.tType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        var type = this.target.getType(true);
        this.eType = this.expression.getType();
        this.aType = type.access || null;
        this.tType = type.target || null;

        if (this.aType) {

            if (this.op !== '=') {
                this.eType = this.tType.getAssignmentReturn(this.op, this.eType);
            }

            return this.setType(this.aType.getType(this.tType, this.eType));

        } else {
            return this.setType(this.tType || type);
        }

    },

    toString: function() {

        if (this.aType) {

            // Handle overloaded in place assignments
            var exprTemplate = this.expression;

            // TODO only fail on index assignments?!
            if (this.op !== '=') {
                var t = this.tType.getAssignmentTemplate(this.op, this.eType);
                exprTemplate = '(' + t(this.target, this.expression) + ')';
            }

            return this.aType.toString(this.target.toString(true),
                                       this.tType, this.eType, exprTemplate);

        } else {
            return this.tType.getAssignmentTemplate(this.op, this.eType)(this.target, this.expression);
        }

    }

});

