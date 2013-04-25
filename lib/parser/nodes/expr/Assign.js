var Node = require('../Node');

Node('Assign', function(target, expr, operator) {
    this.target = target;
    this.expression = expr;
    this.op = operator ? operator : '=';

    this.access = null;
    this.eType = null;
    this.tType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        var type = this.target.getType(true);

        this.access = type.access || null;
        this.eType = this.expression.getType();
        this.tType = type.target || type;

        if (!this.tType.isMutable()) {
            throw new TypeError('Assignment to non-mutable ' + this.tType);
        }

        if (this.access) {

            // TODO index assignments need to overload assigment operators
            //this.eType = this.tType.getAssignmentReturn(this.op, this.eType);

            // TODO support op in Index, Slice  and Member / Property accessors...
            var accessType = type.access.getType(this.tType, this.eType);
            //console.log(accessType);
            accessType.getAssignmentReturn(this.op, this.eType);
            return this.setType(accessType);

        // Direct assigments. Note: This does NOT handle variable declarations
        } else {
            return this.setType(this.tType.getAssignmentReturn(this.op, this.eType));
        }

    },

    toString: function() {

        if (this.access) {

            // Handle overloaded in place assignments
            var exprTemplate = this.expression;

            // TODO only fail on index assignments?!
            if (this.op !== '=') {
                var t = this.tType.getAssignmentTemplate(this.op, this.eType);
                exprTemplate = '(' + t(this.target, this.expression) + ')';
            }

            return this.access.toString(this.target.toString(true),
                                        this.tType, this.eType, exprTemplate);

        } else {
            return this.tType.getAssignmentTemplate(this.op, this.eType)(this.target, this.expression);
        }

    }

});

