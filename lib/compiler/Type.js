function extend(obj, props) {
    for(var p in props) {
        if (props.hasOwnProperty(p)) {
            obj[p] = props[p];
        }
    }
    return obj;
}

// Base Type ------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Type = function(name, subTypes) {

    var type = function Type() {
        this.name = name;
        this.subTypes = subTypes || []; // TODO add support, this is needed for maps and lists...
        this.typeCasts = {};
        this.operators = {};
    };

    type.prototype = extend({}, Type.prototype);

    Type.types[Type.prototype.toString.call({

    })] = type;

    return type;

};

Type.types = {};

Type.toTypeString = function(name, subTypes) {

    if (subTypes.length) {
        return name + '[' + subTypes.join(', ') + ']';

    } else {
        return name;
    }

};

Type.getFromDescription = function(name, subTypes) {
    return Type.types[Type.toTypeString(name, subTypes)];
};

Type.prototype = {

    defineCast: function(type, impl) {
        // TODO support strings AND functions
        // strings in the form of '+$1' and '!!$1.length' which can be inlined
        this.typeCasts[type] = impl;
    },

    defineOperator: function(operator, type, returnType, impl, unary, postFix) {

    },

    addSubType: function(type) {
        this.subTypes.push(type);
    },

    generate: function() {
        // Must generate the cast tables and operators on the fly
    },

    toString: function() {
        // Return a string like version of the type
        return Type.toTypeString(this.name, this.subTypes);
    }

};


module.exports = Type;

