// Emblem Dependencies --------------------------------------------------------
var Type = require('./type/Type');


// Emblem Scope ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Scope = function(block, outerScope) {

    this.block = block;
    this.depth = outerScope ? outerScope.depth + 1 : 0;
    this.outerScope = outerScope;

    this.outerIndent = new Array(this.depth).join('    ');
    console.log(this.outerIndent + '-');
    this.innerIndent = this.outerIndent + '    ';

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

    mapName: function(name) {
        return '_' + name;
    },

    resolveType: function(name, itemTypes) {
        return Type.getTypeDescriptor(name, itemTypes);
    },

    resolveTypeName: function(name, itemTypes) {
        return Type.toString(name, itemTypes);
    },

    toString: function() {
        return '[Scope @ ' + this.depth + ']';
    }

};

module.exports = Scope;

