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
        var type, exprType = this.expression.getType(),
            op = this.op === '=' ? '=' : this.op + '=';

        if (this.target.id === 'Value') {

            type = this.target.getType(true);
            if (type.access) {

                var valueType = type.target;
                if (type.access.id === 'Index') {
                    type = valueType.getIndexSetReturn(op, type.access.getType(), exprType);

                } else if (type.access === 'Range') {
                    return null;

                } else {
                    // Handle member access on structs and classes
                    // TODO what about this in classes?
                    return null;
                }

            } else {
                console.log('non-access assign:', this.target);
                type = type.target;
            }

        } else {
            throw new TypeError('Unimplement assignment stuff');
        }

        return type;

    },

    toString: function() {

        var exprType = this.expression.getType(),
            op = this.op === '=' ? '=' : this.op + '=';

        if (this.target.id === 'Value') {

            var type = this.target.getType(true);
            if (type.access) {

                var valueType = type.target, t;
                if (type.access.id === 'Index') {
                    t = valueType.getIndexSetTemplate(op, type.access.getType(), exprType);
                    return t(this.target.toString(true),
                             type.access.toString(true),
                             this.expression);

                } else if (type.access === 'Range') {
                    return null;

                } else {
                    return null;
                }

            } else {
                return this.target + ' ' + op + ' ' + this.expression;
            }

        } else {
            throw new TypeError('Unimplement assignment stuff');
        }

    }

});

