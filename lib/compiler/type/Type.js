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
            i = itemType.toString(),
            lt = l.toString();

        Type.__lists[lt] = l;

        // Default value
        l.defineDefault('[]');

        // Item operations
        l.defineIndexGet('int', i, '$1[$2])');
        l.defineIndexSet('int', i, i, '$1[$2] = $3');
        l.defineUnaryOp('#', 'int', '$1.length');

        // These return new lists
        l.defineInfixOp('+', i, lt, 'em.list.plusItem($1, $2)');
        l.defineInfixOp('+', lt, lt, 'em.list.plusList($1, $2)');

        // These work on the existing list
        l.defineAssignment('=', lt, '$1 = $2');
        l.defineAssignment('+', i, 'em.list.plusAssignItem($1, $2)');
        l.defineAssignment('+', lt, 'em.list.plusAssignList($1, $2)');

        // Slicing
        l.defineSliceGet('int', 'int', lt, '$1.slice($2, $3)');
        l.defineSliceSet('int', 'int', lt, lt, 'em.list.sliceAssign($1, $2, $3, $4)');

        return l;

    },


    // Map Types --------------------------------------------------------------
    __maps: {},
    createMap: function(keyType, valueType) {

        var m = createType('map', [keyType, valueType]),
            k = keyType.toString(),
            v = valueType.toString(),
            mt = m.toString();

        Type.__maps[mt] = m;

        // Default value
        m.defineDefault('{}');

        // Key / Value operations
        m.defineIndexGet(k, v, '$1[$2]');
        m.defineIndexSet(k, v, v, '$1[$2] = $3');
        m.defineUnaryOp('#', 'int', 'Object.keys($1).length');

        // These create new maps
        m.defineInfixOp('+', mt, mt, 'em.map.plusMap($1, $2)');

        // These work on the existing map
        m.defineAssignment('=', mt, '$1 = $2');
        m.defineAssignment('+', mt, 'em.map.plusAssignMap($1, $2)');

        return m;

    },

    // Struct Types
    __structs: {},
    __structId: {},
    createStruct: function(members, base) {

        var s = createType('struct', []);

        // Members are struct items
        // TODO constatns??!?!
        console.log('struct:', members, base);

        // a struct can extend/inherit a/from another sturct
        // keys can have default values and be constant

        return s;

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

    // Module Types
    createModule: function() {
        return createType('module', []);
    },


    // Will return the type descriptor from a string and the given sub types or
    // base class
    getTypeDescriptor: function(type, itemTypes, base) {

        // Already got a TypeDescriptor
        if (typeof type !== 'string') {
            return type;

        // Lookup Strings
        } else {

            var key = Type.toString(type, itemTypes);

            // Primitives
            if (Type.__primitives.hasOwnProperty(key)) {
                return Type.__primitives[key];

            // Lists / Maps
            } else if (Type.__lists.hasOwnProperty(key)) {
                return Type.__lists[key];

            } else if (Type.__maps.hasOwnProperty(key)) {
                return Type.__maps[key];

            } else if (Type.__structs.hasOwnProperty(key)) {
                return Type.__structs[key];

            } else if (itemTypes && itemTypes.length) {

                if (type === 'list' && itemTypes) {
                    return Type.createList(itemTypes[0]);

                } else if (type === 'map' && itemTypes) {
                    return Type.createMap(itemTypes[0], itemTypes[1]);

                } else if (type === 'struct' && itemTypes) {
                    return Type.createStruct(itemTypes, base);
                }

            }

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

    // Helper function for code generation
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

