var Node = require('../Node');

Node('Comprehension', function(keyType, keyName, valueType, valueName, expr, as, body) {

    // TODO dry with Each
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
    this.as = as;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {

        if (this.key) {
            this.key.type.visit(visitor, this, depth + 1, fromTop);
            this.key.name.visit(visitor, this, depth + 1, fromTop);
        }

        this.value.type.visit(visitor, this, depth + 1, fromTop);
        this.value.name.visit(visitor, this, depth + 1, fromTop);
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.as.visit(visitor, this, depth + 1, fromTop);

    }

});

