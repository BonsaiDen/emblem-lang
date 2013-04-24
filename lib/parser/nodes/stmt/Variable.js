var Node = require('../Node');

Node.Statement('Variable', function(typeDesc, name, expression) {
    this.typeDesc = typeDesc;
    this.name = name;
    this.expression = expression || null;

    this.dType = null;
    this.eType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.typeDesc.visit(visitor, this, depth + 1, fromTop);
        this.name.visit(visitor, this, depth + 1, fromTop);
        this.expression && this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        this.dType = this.typeDesc.getType();
        this.eType = this.expression ? this.expression.getType() : this.dType;

        // TODO handle constants here, need to check type desc
        // and then set contant in defineName and then return the modifier
        // when resolving the name
        this.scope.defineName(this.name.toString(true), this.dType);
        return this.setType(this.dType);

    },

    toString: function() {
        var template = this.dType.getAssignmentTemplate('=', this.eType);
        return template(
            'var ' + this.name,
            this.expression || this.dType.getDefaultValue()
        ) + ';';
    }

});

