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

    this.tempId = 0;

    this.names = {};

};

var base26 = 'abcdefghijklmnopqrstuvwxyz';
function getTemporaryName(value) {
    var name = '';
    while(value) {
        var remainder = value % 26;
        value = Math.floor(value / 26);
        name = base26[remainder].toString() + name;
    }
    return name;
}

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
        return 's' + this.id + '_' + this.depth + '_v_' + name;
    },

    mapTemporyName: function() {
        var name = getTemporaryName(this.tempId++);
        return 's' + this.id + '_' + this.depth + '_t_' + name;
    },

    mapMemberName: function(name) {
        return 'm_' + name;
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
        // TODO handle user defined typenames!
        return Type.getTypeDescriptor(name, itemTypes, base, false); // TODO use base!
    },

    resolveEmptyType: function(name) {
        return Type.getTypeDescriptor(name, [], null, true); // TODO use base!
    },

    resolveTypeName: function(name, itemTypes) {
        return Type.toString(name, itemTypes);
    },


    // Imports ----------------------------------------------------------------
    resolveImport: function(path, alias) {

        path = path.map(function(name) {
            return name.toString(true);

        }).join('.');

        var info = this.module.resolveImport(path, alias);
        info.name = alias ? alias.toString(true) : info.name;
        return info;

    },

    mapImport: function(path) {
    },

    // TODO use correctly
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

    mapExportPath: function(names) {
        return names.map(function(name, i) {
            return name.toString(i > 0);

        }).join('.');
    },

    resolveExportType: function(names) {

        var type = this.resolveName(names[0].toString(true)).type;
        for(var i = 1, l = names.length; i < l; i++) {
            type = type.getPropertyGetType(names[i].toString(true));
        }

        return type;

    },


    // Helper -----------------------------------------------------------------
    toString: function() {
        return '[Scope #' + this.id + ' @ ' + this.depth + ']';
    }

};

module.exports = Scope;

