// Type Description -----------------------------------------------------------
// ----------------------------------------------------------------------------
var Type;
var TypeDescriptor = function(name, subTypes) {

    this.name = name;

    // TODO not needed for actual implementation of lists and maps
    this.subTypes = subTypes || []; // TODO add support, this is needed for maps and lists...

    this.isList = false;
    this.isMap = false;
    this.isFunction = false;
    this.isStruct = false;
    this.isClass = false;

    // Cast and Operator Tables
    this.casts = {};
    this.operators = {

        infix: {},
        unary: {},
        post: {},

        // TODO handle index operators
        index: {
            get: {},
            set: {}
        },

        range: {
            get: {},
            set: {}
        }

    };

};

TypeDescriptor.prototype = {

    // TODO support strings AND functions
    // strings in the form of '+$1' and '!!$1.length' which can be inlined

    // Cast Definitions -------------------------------------------------------
    defineCast: function(type, template) {
        this.casts[type] = template;
    },


    // Operator Type Information ----------------------------------------------
    defineInfixOp: function(op, rightType, returnType, template) {

        if (!this.operators.infix.hasOwnProperty(op)) {
            this.operators.infix[op] = {};
        }

        this.operators.infix[op][rightType.toString()] = {
            returnType: returnType,
            template: template
        };

    },

    defineUnaryOp: function(op, returnType, template) {
        this.operators.unary[op] = {
            returnType: returnType,
            template: template
        };
    },

    definePostOp: function(op, returnType, template) {
        this.operators.post[op] = {
            returnType: returnType,
            template: template
        };
    },

    getOpReturn: function(op, rightType, postFix) {
        return Type.getTypeDescriptor(this.getOpParam(op, rightType, postFix, 'returnType'));
    },

    getOpTemplate: function(op, rightType, postFix) {
        var t = this.getOpParam(op, rightType, postFix, 'template');
        return function(one, two) {
            return t.replace(/\$1/g, '' + one).replace(/\$2/g, '' + two);
        };
    },

    getOpParam: function(op, rightType, postFix, param) {

        var ops = this.operators;
        if (rightType && ops.infix.hasOwnProperty(op)) {

            // Now check if the right hand side is a valid type for the operation
            var infixOp = ops.infix[op],
                rt = rightType.toString();

            if (infixOp.hasOwnProperty(rt))  {
                return infixOp[rt][param];
            }

        } else if (postFix && ops.post.hasOwnProperty(op)) {
            return ops.post[op][param];

        } else if (ops.unary.hasOwnProperty(op)) {
            return ops.unary[op][param];
        }

        // TODO catch these in the compiler
        if (rightType) {
            throw new TypeError('Unsupported operation: ' + this + ' ' + op + ' ' + rightType);

        } else if (postFix) {
            throw new TypeError('Unsupported postifx operation: ' + this + op);

        } else {
            throw new TypeError('Unsupported unary operation: ' + op + this);
        }

    },

    // Indexing Type Information ----------------------------------------------
    defineIndexGetOp: function(indexType, returnType, template) {
        this.operators.index.get[indexType] = {
            returnType: returnType,
            template: template
        };
    },

    getIndexGetReturn: function(indexType) {
        return Type.getTypeDescriptor(this.getIndexParam(indexType, null, 'returnType'));
    },

    getIndexGetTemplate: function(indexType) {
        var t = this.getIndexParam(indexType, null, 'template');
        return function(one, two) {
            return t.replace(/\$1/g, '' + one).replace(/\$2/g, '' + two);
        };
    },

    defineIndexSetOp: function(indexType, assignType, returnType, template) {
        this.operators.index.set[indexType + ' = ' + assignType] = {
            returnType: returnType,
            template: template
        };
    },

    getIndexSetReturn: function(indexType, assignType) {
        return Type.getTypeDescriptor(this.getIndexParam(indexType, assignType, 'returnType'));
    },

    getIndexSetTemplate: function(indexType, assignType) {
        var t = this.getIndexParam(indexType, assignType, 'template');
        return function(target, index, template) {
            return t.replace(/\$1/g, '' + target)
                    .replace(/\$2/g, '' + index)
                    .replace(/\$3/g, '' + template);
        };
    },

    getIndexParam: function(indexType, assignType, param) {

        var ops = this.operators.index;
        if (assignType) {

            var t = indexType.toString() + ' = ' + assignType.toString();
            if (ops.set.hasOwnProperty(t)) {
                return ops.set[t][param];
            }

        } else if (ops.get.hasOwnProperty(indexType.toString())) {
            return ops.get[indexType.toString()][param];
        }

        if (assignType) {
            throw new TypeError('Unsupported index operation: ' + this + '[' + indexType + ']  = ' + assignType);

        } else {
            throw new TypeError('Unsupported index operation: ' + this + '[' + indexType + ']');
        }

    },


    // Slice Type Information ----------------------------------------------
    getSliceGetReturn: function(fromType, toType) {
        // TODO will return a list
        return this.getSliceParam(fromType, toType, 'returnType');
    },

    getSliceSetReturn: function() {

    },




    //generate: function() {
        //// Must generate the cast tables and operators on the fly
        // this should produce overload / cast function tables for JS
    //},

    toString: function() {
        // Return a string like version of the type
        return Type.toString(this.name, this.subTypes);
    }

};


// ----------------------------------------------------------------------------
var Type = {

    // TODO handle var and null?

    // Builtin Types
    __primitives: {},

    createPrimitive: function(name) {
        var t = new TypeDescriptor(name);
        Type.__primitives[t.toString()] = t;
        return t;
    },

    //getPrimitives: function() {
        //return Type.__primitives;
    //},

    // List Types
    createList: function(itemType) {

    },

    // Map Types
    createMap: function(keyType, valueType) {

    },

    // Struct Types
    createStruct: function(keys, keyTypes, keyDefaults, baseStructType) {
        // a struct can extend/inherit a/from another sturct
        // keys can have default values and be constant
    },

    // Function Types
    createFunction: function(returnType, parameters) {
        // functions can have default values, we only need to mark the
        // parameters as true/false for having a default though
        // parameters and returnType can also be constant
    },

    // Class Types
    createClass: function() {
        // classes can have a lot of stuff and overload operators and methods
        // methods and members can also be private or const
    },

    getTypeDescriptor: function(type) {

        // Already got a TypeDescriptor
        if (typeof type !== 'string') {
            return type;

        // Look up primitives
        } else if (Type.__primitives.hasOwnProperty(type)) {
            return Type.__primitives[type];

        // TODO Look up lists, maps, structs etc.
        } else {
            throw new TypeError('Undefined type "' + type + '"');
        }

    },


    // Helper for creating a string describing the type
    toString: function(name, subTypes) {
        // TODO handle class, struct map and list
        if (subTypes && subTypes.length) {
            // TODO refactor for lists / maps
            return name + '[' + subTypes.join(', ') + ']';

        } else {
            return name;
        }
    }

};

module.exports = Type;

// Primitives -----------------------------------------------------------------
require('./types/bool');
require('./types/int');
require('./types/float');
require('./types/string');

