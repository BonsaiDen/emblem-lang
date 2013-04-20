// Emblem Dependencies --------------------------------------------------------
var Type = require('./type/Type');


// Emblem Scope ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Scope = function(block, outerScope, module) {

    this.id = ++Scope.id;
    this.block = block;
    this.depth = outerScope ? outerScope.depth + 1 : 0;
    this.outerScope = outerScope;
    this.module = module;

    this.names = {};

};

Scope.id = 0;

Scope.prototype = {

    // Names ------------------------------------------------------------------
    defineName: function(name, type, isConstant) {

        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            throw new TypeError('Variable "' + name + '" already declared in this scope.');

        } else if (!type) {
            throw new TypeError('Variable "' + name + '" has no type');

        } else {
            this.names[name] = {
                name: name,
                type: type, // structs pass themselves here????
                isConstant: isConstant || false
            };
        }

    },

    mapName: function(name) {
        // TODO count scope id's based on a per module basis?
        return 's' + this.id + '_' + this.depth + '_' + name;
    },

    resolveName: function(name, childScope) {

        // Avoid issues with potential name conflicts
        var origin = null;
        if (Object.prototype.hasOwnProperty.call(this.names, name)) {
            return this.names[name];

        } else if (this.outerScope) {
            origin = this.outerScope.resolveName(name, this);
        }

        // TODO convert into better error handling
        if (origin === null) {
            if (!childScope) {
                throw new Error('"' + name + '" is not defined.');
            }
        }

        return origin;

    },


    // Types ------------------------------------------------------------------
    resolveType: function(name, itemTypes, base) {
        return Type.getTypeDescriptor(name, itemTypes, base);
    },

    resolveTypeName: function(name, itemTypes) {
        return Type.toString(name, itemTypes);
    },


    // Imports ----------------------------------------------------------------
    mapImport: function(list) {

        // Convert to the full name
        var importName = list.map(function(name, i) {
            return name.toString(true);

        }).join('.');

        // The module we're in will need to use the compiler
        // to resolve a.b.c.d into module a.b and export c.d
        return this.module.resolveImport(importName);

    },

    resolveImportType: function(nameList) {

        var type = this.resolveName(nameList[0].toString(true));
        for(var i = 1, l = nameList.length; i < l; i++) {
            type = type.getPropertyGetType(nameList[i].toString(true));
        }

        return type;

    },


    // Exports ----------------------------------------------------------------
    defineExport: function(name, type) {
        this.module.defineExport(name, type);
    },

    mapExport: function(list) {
        return list.map(function(name, i) {
            return name.toString(i > 0);

        }).join('.');
    },

    resolveExportType: function(nameList) {

        var type = this.resolveName(nameList[0].toString(true)).type;
        for(var i = 1, l = nameList.length; i < l; i++) {
            type = type.getPropertyGetType(nameList[i].toString(true));
        }

        return type;

    },


    // Helper -----------------------------------------------------------------
    toString: function() {
        return '[Scope #' + this.id + ' @ ' + this.depth + ']';
    }

};

module.exports = Scope;

