// Type System ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function createType(name, itemTypes) {
    var TypeDescriptor = require('./TypeDescriptor');
    return new TypeDescriptor(name, itemTypes);
}

var Type = {

    // TODO handle var?

    // TODO just have one __cache? All type signatures should be similiar,
    // TODO structs with different defaults, need to have different signatures
    // TODO don't cache / resolve structs with defaults from cache

    // Builtin Types
    __primitives: {},

    createPrimitive: function(name) {
        var t = createType(name);
        Type.__primitives[t.toString()] = t;
        return t;
    },

    // Empty (container) types
    __empty: {},
    createEmpty: function(name, defaultValue) {
        var t = createType(name);
        t.defineDefault(defaultValue);
        Type.__empty[t.toString()] = t;
        return t;
    },


    // List Types -------------------------------------------------------------
    __lists: {},
    emptyList: null,
    createList: function(itemType) {

        // Remove debug check later on
        itemType.isType();

        var l = createType('list', [itemType]),
            lt = l.toString();

        Type.__lists[lt] = l;

        // Default value
        l.defineDefault('[]');

        // Define empty value which can also be used in place of the fully
        // qualified type
        l.defineEmptyType(Type.getTypeDescriptor('list', [], null, true));

        // Item operations
        l.defineIndexGet('int', itemType, '$1[$2])');
        l.defineIndexSet('int', itemType, itemType, '$1[$2] = $3');
        l.defineUnaryOp('#', 'int', '$1.length');

        // These return new lists
        l.defineInfixOp('+', itemType, l, 'em.list.plusItem($1, $2)');
        l.defineInfixOp('+', l, l, 'em.list.plusList($1, $2)');

        // These work on the existing list
        l.defineAssignment('=', l, '$1 = $2');
        l.defineAssignment('+', itemType, 'em.list.plusAssignItem($1, $2)');
        l.defineAssignment('+', l, 'em.list.plusAssignList($1, $2)');

        // Slicing
        l.defineSliceGet('int', 'int', l, 'em.list.slice($1, $2, $3)');
        l.defineSliceSet('int', 'int', l, l, 'em.list.sliceAssign($1, $2, $3, $4)');

        // Boolean
        //l.defineReverseInfixOp('in', itemType, 'bool', '$2.indexOf($1) !== -1') uh... other way around? yes

        return l;

    },


    // Map Types --------------------------------------------------------------
    __maps: {},
    emptyMap: null,
    createMap: function(keyType, valueType) {

        keyType.isType();
        valueType.isType();

        var m = createType('map', [keyType, valueType]),
            mt = m.toString();

        Type.__maps[mt] = m;

        // Default value
        m.defineDefault('{}');

        // Define empty value which can also be used in place of the fully
        // qualified type
        m.defineEmptyType(Type.getTypeDescriptor('map', [], null, true));

        // Key / Value operations
        m.defineIndexGet(keyType, valueType, '$1[$2]');
        m.defineIndexSet(keyType, valueType, valueType, '$1[$2] = $3');
        m.defineUnaryOp('#', 'int', 'Object.keys($1).length');

        // These create new maps
        m.defineInfixOp('+', m, m, 'em.map.plusMap($1, $2)');

        // These work on the existing map
        m.defineAssignment('=', m, '$1 = $2');
        m.defineAssignment('+', m, 'em.map.plusAssignMap($1, $2)');

        // Boolean
        //m.defineReverseInfixOp('in', keyType, 'bool', '$2.hasOwnProperty($1)') uh... other way around? yes
        //m.defineInfixOp('has', valueType, 'bool', '$2.indexOf($1) !== -1') uh... other way around? yes

        return m;

    },

    // Function Types
    createFunction: function(returnType, paramTypes) {

        returnType.isType();
        paramTypes.forEach(function(param) {
            param.isType();
        });

        // TODO how to reference these in other type descriptors? need to have a unique ID / full serialization of their members
        // TODO custom toString on these?
        var m = createType('function', []);
        m.defineCall(); // signature
        m.defineReturn(); // return
        // functions can have default values, we only need to mark the
        // parameters as true/false for having a default though
        // parameters and returnType can also be constant

    },

    // User Types
    createType: function() {
        // TODO how to reference these in other type descriptors? need to have a unique ID / full serialization of their members
        // classes can have a lot of stuff and overload operators and methods
        // methods and members can also be private or const
    },

    // Struct Types
    emptyStruct: null,
    createStruct: function(members, base) {

        var s = createType('struct{}', base ? [base] : []);

        // TODO how to reference these in other type descriptors? need to have a unique ID / full serialization of their members

        // Members are struct items
        // TODO constatns??!?!
        console.log('struct:', members, base);

        // a struct can extend/inherit a/from another sturct
        // keys can have default values and be constant

        return s;

    },

    // Module Types
    createModule: function() {
        return createType('module', []);
    },


    // Will return the type descriptor from a string and the given sub types or
    // base class
    getTypeDescriptor: function(type, itemTypes, base, empty) {

        // Already got a TypeDescriptor
        if (typeof type !== 'string') {
            return type;

        // Lookup Strings
        } else {

            var key = Type.toString(type, itemTypes);

            // Empty containers
            if (empty) {
                return Type.__empty[key];

            // Primitives
            } else if (Type.__primitives.hasOwnProperty(key)) {
                return Type.__primitives[key];

            // Lists / Maps
            } else if (Type.__lists.hasOwnProperty(key)) {
                return Type.__lists[key];

            } else if (Type.__maps.hasOwnProperty(key)) {
                return Type.__maps[key];

            //} else if (Type.__structs.hasOwnProperty(key)) {
                //return Type.__structs[key];

            } else if (itemTypes && itemTypes.length) {

                // TODO what happens with mutable flags here?
                // Could this break when types are resolved?
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
require('./empty/map');
require('./empty/list');

require('./primitive/bool');
require('./primitive/int');
require('./primitive/float');
require('./primitive/string');

