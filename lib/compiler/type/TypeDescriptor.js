// Emblem Dependencies --------------------------------------------------------
var err = require('./errors'),
    Type = require('./Type');


// Class Describing a given type and its properties, members operators --------
// ----------------------------------------------------------------------------
var TypeDescriptor = function(name, itemTypes) {

    this.name = name;
    this.itemTypes = itemTypes || [];

    this.defaultValue = undefined;
    this.assignments = {};
    this.casts = {};
    this.operators = {

        infix: {},
        unary: {},
        post: {},
        pre: {},

        index: {
            get: {},
            set: {}
        },

        range: {
            get: {},
            set: {}
        },

        call: {}

    };

    this.properties = {
        get: {},
        set: {}
    };

    this.members = {};


};

TypeDescriptor.prototype = {

    // Default Values ---------------------------------------------------------
    defineDefault: function(defaultValue) {
        this.defaultValue = defaultValue;
    },

    getDefaultValue: function() {
        if (this.defaultValue !== undefined) {
            return this.defaultValue;

        } else {
            throw err.Default(this);
        }
    },


    // Cast Definitions -------------------------------------------------------
    defineCast: function(target, template) {
        this.casts[target] = {
            returnType: target,
            template: Type.template(template)
        };
    },

    getCastType: function(target) {
        return this.getCastParam(target, 'returnType');
    },

    getCastTemplate: function(target) {
        return this.getCastParam(target, 'template');
    },



    // Assignments ------------------------------------------------------------
    defineAssignment: function(op, type, template) {

        if (!this.assignments.hasOwnProperty(op)) {
            this.assignments[op] = {};
        }

        this.assignments[op][type] = {
            returnType: this,
            template: Type.template(template)
        };

    },

    getAssignmentTemplate: function(op, type) {
        return this.getAssignmentParam(op, type, 'template');
    },

    getAssignmentReturn: function(op, type) {
        return this.getAssignmentParam(op, type, 'returnType');
    },


    // Operator Type Information ----------------------------------------------
    defineInfixOp: function(op, rightType, returnType, template, defineAssign) {

        if (!this.operators.infix.hasOwnProperty(op)) {
            this.operators.infix[op] = {};
        }

        this.operators.infix[op][rightType.toString()] = {
            returnType: returnType,
            template: Type.template(template)
        };

        // Shortcut for defining assignments
        if (defineAssign) {
            this.defineAssignment(op, rightType, '$1 ' + op + '= $2');
        }

    },

    defineUnaryOp: function(op, returnType, template) {
        this.operators.unary[op] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    definePostOp: function(op, returnType, template) {
        this.operators.post[op] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    getOpReturn: function(op, rightType, postFix) {
        return Type.getTypeDescriptor(this.getOpParam(op, rightType, postFix, 'returnType'));
    },

    getOpTemplate: function(op, rightType, postFix) {
        return this.getOpParam(op, rightType, postFix, 'template');
    },


    // Indexing Type Information ----------------------------------------------
    defineIndexGet: function(indexType, returnType, template) {
        this.operators.index.get[indexType] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    getIndexGetReturn: function(indexType) {
        return Type.getTypeDescriptor(this.getIndexParam(indexType, null, 'returnType'));
    },

    getIndexGetTemplate: function(indexType) {
        return this.getIndexParam(indexType, null, 'template');
    },

    defineIndexSet: function(indexType, assignType, returnType, template) {
        this.operators.index.set[indexType + ' = ' + assignType] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    getIndexSetReturn: function(indexType, assignType) {
        return Type.getTypeDescriptor(this.getIndexParam(indexType, assignType, 'returnType'));
    },

    getIndexSetTemplate: function(indexType, assignType) {
        return this.getIndexParam(indexType, assignType, 'template');
    },



    // Slice Type Information ----------------------------------------------
    getSliceGetReturn: function(fromType, toType) {
        // TODO will return a list
        return this.getSliceParam(fromType, toType, 'returnType');
    },

    getSliceSetReturn: function() {

    },


    // Member Definitions -----------------------------------------------------



    // Property Definitions ---------------------------------------------------
    definePropertyGet: function(prop, type, template) {

        var name = '.' + prop;
        if (!this.properties.get.hasOwnProperty(name)) {
            this.properties.get[name] = {
                returnType: type,
                template: template
            };

        // TODO really error out? operators can currently be re-defined
        // either remove error here or add on all other define* methods
        } else {
            throw err.GetterDefined(this, name);
        }

    },

    definePropertySet: function(prop, type, template) {

        var name = '.' + prop;
        if (!this.properties.get.hasOwnProperty(name)) {
            this.properties.set[name] = {
                returnType: type,
                template: template
            };

        // TODO really error out? operators can currently be re-defined
        // either remove error here or add on all other define* methods
        } else {
            throw err.SetterDefined(this, name);
        }

    },

    //generate: function() {
        //// Must generate the cast tables and operators on the fly
        // this should produce overload / cast function tables for JS
    //},

    toString: function() {
        // Return a string like version of the type
        return Type.toString(this.name, this.itemTypes);
    },


    // Helpers ----------------------------------------------------------------
    getOpParam: function(op, rightType, postFix, param) {

        var ops = this.operators;
        if (rightType ) {

            // Now check if the right hand side is a valid type for the operation
            var infixOp = ops.infix[op],
                rt = rightType.toString();

            if (ops.infix.hasOwnProperty(op) && infixOp.hasOwnProperty(rt))  {
                return infixOp[rt][param];

            } else {
                throw err.Infix(op, this, rightType);
            }

        } else if (postFix) {
            if (ops.post.hasOwnProperty(op)) {
                return ops.post[op][param];

            } else {
                throw err.Postfix(op, this);
            }

        } else if (ops.unary.hasOwnProperty(op)) {
            return ops.unary[op][param];

        // TODO unary vs. prefix
        } else {
            throw err.Unary(op, this);
        }

    },

    getIndexParam: function(indexType, assignType, param) {

        var ops = this.operators.index;
        if (assignType) {

            var t = indexType.toString() + ' = ' + assignType.toString();
            if (ops.set.hasOwnProperty(t)) {
                return ops.set[t][param];

            } else {
                throw err.Index(this, indexType, assignType);
            }

        } else if (ops.get.hasOwnProperty(indexType.toString())) {
            return ops.get[indexType.toString()][param];

        } else {
            throw err.Index(this, indexType, assignType);
        }

    },

    getCastParam: function(targetType, param) {
        if (!this.casts.hasOwnProperty(targetType)) {
            throw err.Cast(this, targetType);

        } else {
            return this.casts[targetType][param];
        }
    },

    getAssignmentParam: function(op, type, param) {

        if (this.assignments.hasOwnProperty(op)) {
            if (this.assignments[op].hasOwnProperty(type)) {
                return this.assignments[op][type][param];

            } else {
                throw err.Assignment(this, op, type);
            }

        } else {
            throw err.Assignment(this, op, type);
        }

    }

};

module.exports = TypeDescriptor;

