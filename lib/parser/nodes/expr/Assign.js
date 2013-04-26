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

        if (!type.target) {
            return false;

        } else if (!this.tType.isMutable()) {
            throw new TypeError('Assignment to non-mutable ' + this.tType);
        }

        if (this.access) {

            // Type of the value resulting from the access
            var accessType = type.access.getType(this.tType, this.eType);

            // Type resulting from assiging to the accessType
            var assignReturnType = accessType.getAssignmentReturn(this.op, this.eType);

            // TODO DONE? support op in Index, Slice  and Member / Property accessors...
            // TODO fix coder generation
            return this.setType(assignReturnType);

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

