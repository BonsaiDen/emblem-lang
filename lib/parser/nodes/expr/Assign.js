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

        // TODO handle identifier types and stuff
        var exprType = this.expression.getType(),
            type = this.target.getType(true),
            targetType = type.target || null;

        // Handle overloaded operators in assignments
        if (this.op !== '=') {
            exprType = targetType.getOpReturn(this.op, exprType);
        }

        // Handle var[x] = y type assignments
        if (type.access) {

            var accessType = type.access.getType();
            if (type.access.id === 'Index') {
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
        var exprType = this.expression.getType();
        if (this.target.id === 'Value') {

            var type = this.target.getType(true),
                targetType = type.target,
                assignTemplate = this.op === '=' ? this.expression :
                                '(' + targetType.getOpTemplate(this.op, exprType)(this.target, this.expression) + ')';

            if (type.access) {

                if (type.access.id === 'Index') {
                    var t = targetType.getIndexSetTemplate(type.access.getType(), exprType);
                    return t(this.target.toString(true),
                             type.access.toString(true),
                             assignTemplate);

                } else if (type.access === 'Range') {
                    return null;

                } else {
                    return null;
                }

            } else {
                return targetType.getAssignmentTemplate(this.op, exprType)(this.target, this.expression);
            }

        } else {
            throw new TypeError('Unimplement assignment stuff');
        }

    }

});

