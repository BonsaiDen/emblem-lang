var path = require('path'),
    fs = require('fs');

// Emblem Dependencies --------------------------------------------------------
var Module = require('./Module');


// Actual Compiler ------------------------------------------------------------
// ----------------------------------------------------------------------------
var Compiler = function() {
    this.errors = [];
    this.warnings = [];
    this.modules = [];
};

Compiler.prototype = {

    compile: function(name) {
        return this.compileModule(null, name);
    },

    compileModule: function(parent, name) {
        var mod = this.resolveModuleByImport(parent, name, path.resolve(process.cwd()));
        return mod && mod.compile();
    },

    resolveModuleByImport: function(parent, name, dir) {

        var list = name.split('.'),
            dirName = dir;

        // Resolve foo.bar.test
        //
        // - If there's a file with the current list part, we use that and then try to lookup it's exports
        // - If there's a folder with the current list name, we enter it
        // - If there's neither a folder or a name, we fail
        //
        // We stop at the first .em file we can find
        var module = null,
            moduleName = [];

        while(true) {

            var l = list.shift() || '',
                d = path.join(dirName, l),
                f = path.join(dirName, l +'.em'),
                i = path.join(dirName, 'index.em');

            // File
            if (fs.existsSync(f)) {
                if (fs.lstatSync(f).isFile()) {
                    moduleName.push(l);
                    module = new Module(this, parent, moduleName.join('.'), f);
                    break;

                } else {
                    this.error(parent, null, f + ' is not a file.');
                    break;
                }

            // index.em in directoy
            } else if (fs.existsSync(i)) {

                if (fs.lstatSync(i).isFile()) {
                    module = new Module(this, parent, moduleName.join('.'), i);
                    break;

                } else {
                    this.error(null, null, i + ' is not a file.');
                    break;
                }

            // Directory
            } else if (fs.existsSync(d)) {

                if (fs.lstatSync(d).isDirectory()) {
                    moduleName.push(l);
                    dirName = d;
                    continue;

                } else {
                    this.error(parent, null, f + ' is not a directory.');
                    break;
                }

            }

        }

        // TODO import statement MUST check whether the full name was imported
        // if not, it needs to lookup the exports of the imported module
        // TODO check for circular imports
        return module;

    },

    error: function(module, loc, message) {
        this.errors.push({
            module: module,
            loc: loc,
            message: message
        });
    },

    warning: function(module, loc, message) {
        this.warnings.push({
            module: module,
            loc: loc,
            message: message
        });
    },

    toString: function() {
        // generate anonymous wrapper
        // generate all module codes, hook them to the global module table
        // generate builtin types
    }

};

module.exports = Compiler;

