var Node = require('../Node');

Node.Block('Each', function(keyType, keyName, valueType, valueName, expr, body) {

    // TODO dry with Comprehension
    if (!valueType) {
        this.key = null;
        this.value = {
            type: keyType,
            name: keyName
        };

    } else {
        this.key = {
            type: keyType,
            name: keyName
        };

        this.value = {
            type: valueType,
            name: valueName
        };
    }

    this.expr = expr;
    this.body = body;

    this.eType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {

        if (this.key) {
            this.key.type.visit(visitor, this, depth + 1, fromTop);
            this.key.name.visit(visitor, this, depth + 1, fromTop);
        }

        this.value.type.visit(visitor, this, depth + 1, fromTop);
        this.value.name.visit(visitor, this, depth + 1, fromTop);
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);

    },

    init: function() {
        this.eType = this.expr.getType();
        // TODO define iterator key / value names in the BODY SCOPE TODO
        // TODO check if key / value are compatible with the expression type
        return true;
    },

    toString: function() {
        // in case the expression is a range op we need temporary variables and stuff

        var ta = this.scope.mapTemporyName(),
            tb = this.scope.mapTemporyName();

        if (this.key) {
            return this.toWrapped(0, this.body, 'for(var in) { if (hasOwnProperty()) {', '} }');

        } else {
            return this.toWrapped(0, this.body, 'for(var ' + ta + ' = ; ;) {', '}');
        }

    }

});

