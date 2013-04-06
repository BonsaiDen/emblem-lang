// Emblem Dependencies --------------------------------------------------------
var Type = require('./Type');


// Emblem Scope ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Scope = function(block, outerScope) {

    this.block = block;
    this.depth = outerScope ? outerScope.depth + 1 : 0;
    this.outerScope = outerScope;

    // check structure
    this.names = {
        'foo': {
            name: 'foo',
            type: null
        }
    };

};

Scope.prototype = {

    resolveName: function(name) {

        // Avoid issues with name conflicts
        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            return this.names[name];

        } else {
            return this.outerScope && this.outerScope.resolveName(name);
        }

    },

    resolveType: function(name) {
        return Type.getTypeDescriptor(name);
    },

    //resolveType: function(signature) {

        //// Avoid issues with name conflicts
        //if (Object.prototype.hasOwnProperty.call(this.types, signature)) {
            //return this.types[signature];

        //} else {
            //return this.outerScope && this.outerScope.resolveType(signature);
        //}

    //},

    toString: function() {
        return '[Scope @ ' + this.depth + ']';
    }

};

module.exports = Scope;

