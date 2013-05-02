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

        // Type resolving failed, prevent further errors from piling up
        if (!this.dType || !this.eType) {
            return false;
        }

        // Check if the assignment is the empty version of a generic container
        if (this.dType.hasEmptyType(this.eType)) {
            this.eType = this.dType;
            this.dtype = this.dType;
        }

        // This allows for overloading of initial type assignments
        var type = this.dType.getAssignmentReturn('=', this.eType);

        // Make sure to copy over the modifiers from the type descriptor
        type = type.withModifiers(this.dType.getModifiers());

        this.scope.defineName(this.name.toString(true), type);
        return this.setType(type);

    },

    toString: function() {
        var template = this.dType.getAssignmentTemplate('=', this.eType);
        return template(
            'var ' + this.name,
            this.expression || this.dType.getDefaultValue()

        ) + ';';
    }

});

