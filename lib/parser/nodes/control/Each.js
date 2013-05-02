var Node = require('../Node');

Node.Block('Each', function(keyType, keyName, valueType, valueName, expr, body) {
    this.expr = expr;
    this.body = body;

}, {


});

