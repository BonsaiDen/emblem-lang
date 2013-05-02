var Node = require('../Node');

Node.Block('If', function(condition, body, elifList, elseBlock) {
    this.condition = condition;
    this.body = body;
    this.elifList = elifList || [];
    this.elseBlock = elseBlock || null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {

        this.condition.visit(visitor, this, depth + 1, fromTop);
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
        if (this.condition.getType() !== bool) {
            throw new TypeError('expression of if statment must be boolean');

        } else {
            return true;
        }

    },

    toString: function() {
        return this.toWrapped(0, this.body, 'if (' + this.condition + ') {', '}')
               + this.elifList.join('')
               + (this.elseBlock ? this.elseBlock : '');
    }

});

