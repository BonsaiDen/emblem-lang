// Emblem Dependencies --------------------------------------------------------
var Type = require('./type/Type');


// Emblem Scope ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Scope = function(block, outerScope) {

    this.block = block;
    this.depth = outerScope ? outerScope.depth + 1 : 0;
    this.outerScope = outerScope;
    this.names = {};

};

Scope.prototype = {

    resolveName: function(name, childScope) {

        // Avoid issues with potential name conflicts
        var origin = null;
        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            return this.names[name];

        } else if (this.outerScope) {
            origin = this.outerScope.resolveName(name, this);
        }

        // TODO convert into better error thing
        if (origin === null) {
            if (!childScope) {
                throw new Error('"' + name + '" is not defined.');
            }
        }

        return origin;

    },

    defineName: function(name, typeDesc, isConstant) {

        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            throw new TypeError('Variable "' + name + '" already declared in this scope.');

        } else {

            var type = typeDesc.getType();
            if (!type) {
                throw new TypeError('Variable "' + name + '" has no type');
            }

            this.names[name] = {
                name: name,
                type: type, // structs pass themselves
                // TODO uhhh implement?
                isConstant: isConstant || false
            };
        }

    },

    mapName: function(name) {
        return 's' + this.depth + '_' + name;
    },

    resolveType: function(name, itemTypes, base) {
        return Type.getTypeDescriptor(name, itemTypes, base);
    },

    resolveTypeName: function(name, itemTypes) {
        return Type.toString(name, itemTypes);
    },

    toString: function() {
        return '[Scope @ ' + this.depth + ']';
    }

};

module.exports = Scope;

