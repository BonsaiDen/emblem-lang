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

    }

});

