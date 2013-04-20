var Node = require('../Node');

Node('Assign', function(target, expr, operator) {
    this.target = target;
    this.expression = expr;
    this.op = operator ? operator : '=';

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO validate stuff
        // move get type in here?
        return true;
    },

    getType: function() {

        var exprType = this.expression.getType(),
            type = this.target.getType(true),
            targetType = type.target || null;

        if (type.access) {

            if (this.op !== '=') {
                exprType = targetType.getAssignmentReturn(this.op, exprType);
            }

            type = type.access.getType(targetType, exprType);

        } else {
            type = type.target || type;
        }

        return type;

    },

    toString: function() {

        // TODO handle assignments to constants and error out
        var exprType = this.expression.getType(),
            type = this.target.getType(true),
            targetType = type.target;

        if (type.access) {

            // Handle overloaded in place assignments
            var assignTmpl = this.expression;

            if (this.op !== '=') {
                // TODO only fail on index assignments?!
                var t = targetType.getAssignmentTemplate(this.op, exprType);
                assignTmpl = '(' + t(this.target, this.expression) + ')';
            }

            return type.access.toString(this.target.toString(true),
                                        targetType, exprType, assignTmpl);

        } else {
            return targetType.getAssignmentTemplate(this.op, exprType)(this.target, this.expression);
        }

    }

});

