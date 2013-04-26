// Emblem Dependencies --------------------------------------------------------
var err = require('./errors'),
    Type = require('./Type');


// Class Describing a given type and its properties, members operators --------
// ----------------------------------------------------------------------------
var TypeDescriptor = function(name, itemTypes) {

    this.name = name;
    this.itemTypes = itemTypes || [];

    this.defaultValue = undefined;
    this.emptyType = undefined;

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

        slice: {
            get: {},
            set: {}
        },

        call: {}

    };

    this.properties = {};
    this.members = {};

    this.call = null;

};

TypeDescriptor.prototype = {

    isType: function() {
        return true;
    },

    withModifiers: function(modifier) {

        function ModifiedTypeDescriptor(modifier) {
            this._modifier = modifier;
        }

        ModifiedTypeDescriptor.prototype = this;
        return new ModifiedTypeDescriptor(modifier);

    },

    isPublic: function() {
        return (this._modifier & 1) === 1;
    },

    isProtected: function() {
        return (this._modifier & 2) === 2;
    },

    isPrivate: function() {
        return (this._modifier & 4) === 4;
    },

    isMutable: function() {
        return (this._modifier & 8) === 8;
    },

    isStatic: function() {
        return (this._modifier & 16) === 16;
    },


    // Default Values ---------------------------------------------------------
    defineDefault: function(defaultValue) {
        this.defaultValue = defaultValue;
    },

    defineEmpty: function(emptyType) {
        this.emptyType = emptyType;
    },

    getDefaultValue: function() {
        if (this.defaultValue !== undefined) {
            return this.defaultValue;

        } else {
            throw err.Default(this);
        }
    },


    // Call -------------------------------------------------------------------
    defineCall: function(returnType, signature, template) {
        this.call = {
            returnType: returnType,
            signature: signature,
            template: Type.template(template)
        };
    },

    getCallReturn: function() {

    },

    getCallSignature: function() {

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
    defineSliceGet: function(fromType, toType, returnType, template) {
        this.operators.slice.get[fromType + ' : ' + toType] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    getSliceGetReturn: function(fromType, toType) {
        return this.getSliceParam(fromType, toType, null, 'returnType');
    },

    getSliceGetTemplate: function(fromType, toType) {
        return this.getSliceParam(fromType, toType, null, 'template');
    },

    defineSliceSet: function(fromType, toType, assignType, returnType, template) {
        this.operators.slice.set[fromType + ' : ' + toType + ' = ' + assignType] = {
            returnType: returnType,
            template: Type.template(template)
        };
    },

    getSliceSetReturn: function(fromType, toType, assignType) {
        return this.getSliceParam(fromType, toType, assignType, 'returnType');
    },

    getSliceSetTemplate: function(fromType, toType, assignType) {
        return this.getSliceParam(fromType, toType, assignType, 'template');
    },


    // Member Definitions -----------------------------------------------------



    // Property Definitions ---------------------------------------------------
    defineProperty: function(prop, type, get, set) {
        this.properties['.' + prop] = {
            type: type,
            get: Type.template(get),
            set: set ? Type.template(set) : null
        };
    },

    getPropertyType: function(prop) {
        return this.getPropertyParam(prop, true, 'type');
    },

    getPropertyGetTemplate: function(prop) {
        return this.getPropertyParam(prop, false, 'get');
    },

    getPropertySetTemplate: function(prop) {
        return this.getPropertyParam(prop, true, 'set');
    },

    hasProperty: function(prop) {
        return this.properties.hasOwnProperty('.' + prop);
    },

    hasPropertySetter: function(prop) {
        return this.hasProperty(prop) && this.properties['.' + prop].set;
    },


    // Helpers ----------------------------------------------------------------
    toString: function() {

        // TODO needs support in scope.resolveType to handle modifiers...
        var prefixes = [];
        if (this.isMutable()) {
            prefixes.push('mutable');
        }

        var prefix = '';
        if (prefixes.length) {
            prefix = '(' + prefixes.join(' ') + ')';
        }

        return Type.toString(this.name, this.itemTypes);

    },

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

    getSliceParam: function(fromType, toType, assignType, param) {

        var ops = this.operators.slice,
            type = fromType.toString() + ' : ' + toType.toString();

        if (assignType) {

            var t = type + ' = ' + assignType.toString();
            if (ops.set.hasOwnProperty(t)) {
                return ops.set[t][param];

            } else {
                throw err.Slice(this, fromType, toType, assignType);
            }

        } else if (ops.get.hasOwnProperty(type)) {
            return ops.get[type][param];

        } else {
            throw err.Slice(this, fromType, toType, assignType);
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

    },

    getPropertyParam: function(prop, setter, param) {

        var props = this.properties,
            name = '.' + prop;

        if (props.hasOwnProperty(name)) {
            return props[name][param];

        } else {
            throw err.Property(this, prop, setter);
        }

    }

};

module.exports = TypeDescriptor;

