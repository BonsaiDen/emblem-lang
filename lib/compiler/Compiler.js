var path = require('path'),
    fs = require('fs');

// Emblem Dependencies --------------------------------------------------------
var Module = require('./Module');


// Compiler -------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Compiler = function() {
    this.modules = {};
};

Compiler.prototype = {


    // Module Compilation and Caching -----------------------------------------
    // ------------------------------------------------------------------------
    getModule: function(name, parent) {

        // Figure out the base for the
        var base = parent ? parent.getBase() : process.cwd();

        // Resolve the path and name
        var meta = this.resolveModuleName(base, name);
        if (meta) {

            // Do a cache lookup for the resolved module name
            var cached = this.modules[meta.file];
            if (cached) {
                return {
                    meta: meta,
                    module: cached
                };

            // Compile the module
            } else {

                var module = new Module(this, parent, meta);
                module.compile();

                this.modules[meta.file] = module;
                return {
                    meta: meta,
                    module: module
                };

            }

        } else {
            // Error out!
            throw new Error('Could not resolve "' + name + '".');
        }

    },


    // Resolve Imports and Modules --------------------------------------------
    // ------------------------------------------------------------------------
    resolveModuleImport: function(importName, parent) {
        var info = this.getModule(importName, parent);
        return {
            importName: info.meta.importName,
            module: info.module
        };
    },

    resolveModuleName: function(basePath, name) {

        function isDir(path) {
            return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
        }

        function isFile(path) {
            return fs.existsSync(path) && fs.lstatSync(path).isFile();
        }

        var namePath = name.split('.'),
            moduleName = [namePath.shift()];

        while(true) {

            var modulePath = path.join(basePath, path.join.apply(null, moduleName)),
                moduleFile = modulePath + '.em';

            // Directories always take precedence over all other possible paths
            if (isDir(modulePath)) {

                var checkMain = false;

                // If we're at the end of our path, check for a main.em file
                if (namePath.length === 0) {
                    checkMain = true;

                // Otherwise, we'll do a look-ahead to see if we can find a
                // directory or file with the next name that we could enter
                } else {

                    var nextName = moduleName.concat(namePath[0]),
                        nextPath = path.join(basePath, path.join.apply(null, nextName)),
                        nextFile = nextPath + '.em';

                    // If we find it, keep resolving
                    if (isDir(nextPath) || isFile(nextFile)) {
                        moduleName.push(namePath.shift());

                    // If not, we need to check for a main.em file and grab
                    // the rest of the name as an export from that file
                    } else {
                        checkMain = true;
                    }

                }

                // Check for a main.em which could be used to require things
                if (checkMain) {

                    var mainFile = path.join(modulePath, 'main.em');
                    if (isFile(mainFile)) {
                        return {
                            base: modulePath,
                            file: modulePath + '/main.em',
                            moduleName: moduleName.join('.'),
                            importName: namePath.join('.') || '*'
                        };

                    } else {
                        return null;
                    }

                }

            // Next we check for any files matching the given name
            } else if (isFile(moduleFile)) {
                return {
                    base: basePath,
                    file: modulePath + '.em',
                    name: moduleName.join('.'),
                    importName: namePath.join('.') || '*'
                };

            } else {
                // Nothing found, oh noes we cannot resolve it :(
                return null;
            }

        }

    }

};

module.exports = Compiler;

