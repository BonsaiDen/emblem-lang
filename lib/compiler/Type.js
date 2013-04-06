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
        index: {}
    };

};

TypeDescriptor.prototype = {

    // TODO support strings AND functions
    // strings in the form of '+$1' and '!!$1.length' which can be inlined
    defineCast: function(type, template) {
        this.casts[type] = template;
    },


    // Operator Definitions ---------------------------------------------------
    defineOp: function(op, rightType, returnType, template) {

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


    // Access to Type Information ---------------------------------------------
    getOpReturn: function(op, rightType, postFix) {
        return Type.getTypeDescriptor(this.getTypeParam(op, rightType, postFix, 'returnType'));
    },

    getOpTemplate: function(op, rightType, postFix) {
        var t = this.getTypeParam(op, rightType, postFix, 'template');
        return function(one, two) {
            return t.replace(/\$1/g, '' + one).replace(/\$2/g, '' + two);
        };
    },

    getTypeParam: function(op, rightType, postFix, param) {

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


    // Operator Definitions ---------------------------------------------------
    getCast: function() {

    },

    getOperator: function() {

    },

    addSubType: function(type) {
        this.subTypes.push(type);
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

