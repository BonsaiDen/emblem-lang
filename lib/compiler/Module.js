var fs = require('fs');

// Emblem Dependencies --------------------------------------------------------
var Scope = require('./Scope'),
    Ast = require('../parser/Ast');


// Emblem Module --------------------------------------------------------------
// ----------------------------------------------------------------------------
var Module = function(compiler, parent, meta) {

    console.log('[%s] @ %s', meta.name, meta.file);

    // References
    this.compiler = compiler;
    this.parent = parent;
    this.meta = meta;

    // All errors and warnings thrown within this module
    this.errors = [];
    this.warnings = [];

    // Ast and other things
    this.ast = null;
    this.scope = new Scope(null, null, this);
    this.exports = {};

};

Module.prototype = {


    // Methods ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    compile: function() {
        var source = fs.readFileSync(this.meta.file, 'utf8').toString();
        return this.build(source);
    },


    // Getters ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    getBase: function() {
        return this.meta.base;
    },

    getFile: function() {
        return this.meta.file;
    },

    getName: function() {
        return this.meta.name;
    },


    // AST Handling -----------------------------------------------------------
    // ------------------------------------------------------------------------
    build: function(source) {

        var start = Date.now();

        // Create AST from source
        this.ast = new Ast(source, this.scope);

        // Add scope objects to tree and initialize the nodes fully
        this.ast.visit(function(node, parent, depth) {

            // Find the next scope above us
            var outerScope = node.findAbove(function(node) {
                if (node.scope) {
                    return node.scope;
                }
            });

            // Blocks create a new scope
            if (node.isBlock()) {
                node.scope = new Scope(node, outerScope, this);

            // Everything else inherits from their parent
            } else {
                node.scope = outerScope;
            }

        }, true);

        // Initialize the tree
        this.ast.visit(function(node, parent, depth) {
            node.init();

        }, true);

        console.log('Compiled in: %sms', Date.now() - start);

        if (this.isValid()) {
            return this.generate();

        } else {
            return false;
        }

    },


    // Code Generation --------------------------------------------------------
    generate: function() {

        var code,
            start = Date.now();

        try {
            code = this.toString();

        } catch(e) {
            this.errors.push(e);
        }

        console.log(code);
        console.log('Generated in: %sms', Date.now() - start);

        return this.isValid() ? code : null;

    },

    // Validation -------------------------------------------------------------
    isValid: function() {

        // Collect errors and warnings
        var that = this;
        this.ast.visit(function(node, parent, depth) {

            that.errors.push.apply(that.errors, node.errors);
            node.errors.length = 0;

            that.warnings.push.apply(that.errors, node.warnings);
            node.warnings.length = 0;

        }, true);

        if (this.errors.length + this.warnings.length) {
            this.errors.forEach(function(err) {
                if (err.stack) {
                    console.log(err + '\n' + err.stack);

                } else {
                    console.log('' + err);
                }
            });
            return false;

        } else {
            return true;
        }

    },


    // Import -----------------------------------------------------------------
    resolveImport: function(importName) {

        var meta = this.compiler.resolveModuleImport(importName, this);
        return meta.module.getExportType(meta.importName);

    },


    // Export -----------------------------------------------------------------
    defineExport: function(name, type) {

        if (Object.prototype.hasOwnProperty.call(this.exports, name)) {
            throw new TypeError('Export "' + name + '" already declared in this module.');

        } else {
            this.exports[name] = type;
        }

    },

    getExportType: function(name) {

        if (Object.prototype.hasOwnProperty.call(this.exports, name)) {
            return this.exports[name];

        } else {
            throw new TypeError('Module ' + this.meta.name + ' does not export "' + name + '".');
        }

    },


    // Helper -----------------------------------------------------------------
    toString: function() {

        // generate all user types, encapsulate the module in a wrapper
        // global support functions (TODO later on, only generate required stuff to keep run time small)
        var header = '(function(__modules, __exports) {\n',
            footer = '\n})({}, {})';

        return header + this.ast.toString() + footer;

    }

};

module.exports = Module;

