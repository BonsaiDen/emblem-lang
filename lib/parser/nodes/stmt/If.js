var Node = require('../Node');

Node.Block('If', function(expr, body, elifList, elseBlock) {
    this.expr = expr;
    this.body = body;
    this.elifList = elifList || [];
    this.elseBlock = elseBlock || null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {

        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);

        this.each(this.elifList, function(elif) {
            elif.visit(visitor, this.parent, depth, fromTop);
        });

        this.elseBlock && this.elseBlock.visit(visitor, this.parent, depth, fromTop);

    },

    init: function() {

        // TODO if expr isPrimitive resolve it and see if it always results in
        // true or false
        var bool = this.scope.resolveType('bool');
        if (this.expr.getType() !== bool) {
            throw new TypeError('expression of if statment must be boolean');

        } else {
            return true;
        }

    },

    toString: function() {
        return this.toWrapped(0, this.body, 'if (' + this.expr + ') {', '}')
               + this.elifList.join('')
               + (this.elseBlock ? this.elseBlock : '');
    }

});

