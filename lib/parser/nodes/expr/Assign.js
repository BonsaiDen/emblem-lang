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

    getType: function() {

        var exprType = this.expression.getType(),
            type = this.target.getType(true),
            targetType = type.target || null;

        if (type.access) {

            var accessType = type.access.getType();
            if (type.access.id === 'Index') {

                // Handle overloaded operators in index assignments
                if (this.op !== '=') {
                    exprType = targetType.getAssignmentReturn(this.op, exprType);
                }

                type = targetType.getIndexSetReturn(accessType, exprType);

            } else if (type.access.id === 'Range') {
                return null;

            } else {
                // Handle member access on structs and classes
                // TODO what about this in classes?
                return null;
            }

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
            if (type.access.id === 'Index') {

                var assign = this.expression,
                    t = null;

                // TODO prevent assignments to casted index parameters?

                // Handle overloaded in place assignments
                if (this.op !== '=') {
                    // TODO only fail on index assignments
                    t = targetType.getAssignmentTemplate(this.op, exprType);
                    assign = '(' + t(this.target, this.expression) + ')';
                }

                // Handle in place operator assignments on indexes
                t = targetType.getIndexSetTemplate(type.access.getType(), exprType);
                return t(this.target.toString(true),
                         type.access.toString(true), assign);

            } else if (type.access === 'Range') {
                return null;

            } else {
                return null;
            }

        } else {
            return targetType.getAssignmentTemplate(this.op, exprType)(this.target, this.expression);
        }

    }

});

