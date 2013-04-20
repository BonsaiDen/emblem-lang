var Node = require('../Node');

Node.Statement('Variable', function(typeDesc, name, expression) {
    this.typeDesc = typeDesc;
    this.name = name;
    this.expression = expression || null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.typeDesc.visit(visitor, this, depth + 1, fromTop);
        this.name.visit(visitor, this, depth + 1, fromTop);
        this.expression && this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO handle constant pass in here
        this.scope.defineName(this.name.toString(true), this.typeDesc.getType());
        return true;
    },

    getType: function() {
        return this.typeDesc.getType();
    },

    toString: function() {

        var type = this.getType(),
            exprType = this.expression ? this.expression.getType() : type,
            template = type.getAssignmentTemplate('=', exprType),
            value = this.expression || type.getDefaultValue();

        return template('var ' + this.name, value) + ';';

    }

});

