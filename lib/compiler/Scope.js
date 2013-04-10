// Emblem Dependencies --------------------------------------------------------
var Type = require('./type/Type');


// Emblem Scope ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Scope = function(block, outerScope) {

    this.block = block;
    this.depth = outerScope ? outerScope.depth + 1 : 0;
    this.outerScope = outerScope;

    // check structure
    this.names = {};

};

Scope.prototype = {

    resolveName: function(name, childScope) {

        // Avoid issues with potential name conflicts
        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            return this.names[name];

        } else if (this.outerScope) {
            return this.outerScope.resolveName(name, this);

        } else {
            // TODO convert into better error thing
            if (!childScope) {
                throw new Error('"' + this.toString() + '" is not defined.' + this.line);
            }
            return null;
        }

    },

    defineName: function(name, typeDesc) {

        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            throw new TypeError('Variable "' + name + '" already declared in this scope.');

        } else {
            this.names[name] = {
                name: name,
                type: typeDesc.getType(),
                isConstant: typeDesc.isConstant
            };
        }

    },

    resolveType: function(name, itemTypes) {
        return Type.getTypeDescriptor(name, itemTypes);
    },

    resolveTypeNameFromNode: function(typeNode) {
        return Type.toString(typeNode.name, typeNode.itemTypes);
    },

    toString: function() {
        return '[Scope @ ' + this.depth + ']';
    }

};

module.exports = Scope;

