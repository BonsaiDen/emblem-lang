// Type System ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function createType(name, itemTypes) {
    var TypeDescriptor = require('./TypeDescriptor');
    return new TypeDescriptor(name, itemTypes);
}

var Type = {

    // TODO handle var and null?

    // TODO just have one __cache? All type signatures should be similiar,
    // TODO structs with different defaults, need to have different signatures
    // TODO also needed for
    // TODO don't cache / resolve structs with defaults from cache

    // Builtin Types
    __primitives: {},

    createPrimitive: function(name) {
        var t = createType(name);
        Type.__primitives[t.toString()] = t;
        return t;
    },


    // List Types -------------------------------------------------------------
    __lists: {},
    createList: function(itemType) {

        var l = createType('list', [itemType]),
            i = itemType.toString();

        var lt = l.toString();
        l.defineDefault('[]');
        l.defineIndexGet('int', i, '$1[$2])');
        l.defineIndexSet('int', i, i, '$1[$2] = $3');
        l.defineUnaryOp('#', 'int', '$1.length');

        // These return new lists
        l.defineInfixOp('+', i, lt, '[].concat($1, $2)');
        //l.defineInfixOp('*', i, lt);

        // These work on the existing list
        l.defineAssignment('+', i, lt, '$1.push($2)');
        l.defineAssignment('+', lt, lt, '$1.push.apply($1, $2)');

        Type.__lists[l.toString()] = l;
        return l;

    },


    // Map Types --------------------------------------------------------------
    __maps: {},
    createMap: function(keyType, valueType) {

        var m = createType('map', [keyType, valueType]),
            k = keyType.toString(),
            v = valueType.toString();

        m.defineIndexGet(k, v, '$1[$2])');
        m.defineIndexSet(k, v, v, '$1[$2] = $3');
        m.defineUnaryOp('#', 'int', 'Object.keys($1).length');

        Type.__maps[m.toString()] = m;
        return m;

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
    toString: function(name, itemTypes) {
        if (itemTypes && itemTypes.length) {
            return name + '[' + itemTypes.join(', ') + ']';

        } else {
            return name;
        }
    },

    template: function(template) {

        return function() {

            if (typeof template === 'function') {
                return template.apply(null, arguments);

            } else {

                var tmp = '' + template;
                for(var i = 0, l = arguments.length; i < l; i++) {

                    var arg = arguments[i],
                        regexp = new RegExp('\\$' + (i + 1), 'g');

                    tmp = tmp.replace(regexp, arg);

                }

                return tmp;

            }

        };

    }

};

module.exports = Type;

// Load and Register Builtin Types --------------------------------------------
require('./primitive/bool');
require('./primitive/int');
require('./primitive/float');
require('./primitive/string');

