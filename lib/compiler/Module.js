var fs = require('fs');

// Emblem Dependencies --------------------------------------------------------
var Scope = require('./Scope'),
    Type = require('./type/Type'),
    Parser = require('../parser/Parser');


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

    // Exports
    this.baseExportType = Type.createModule();
    this.exportType = this.baseExportType;
    this.exports = [];

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
        this.ast = new Parser.parse(source, this.scope);

        // Add scope objects to tree and initialize the nodes fully
        var that = this;
        this.ast.visit(function(node, parent, depth) {

            // Find the next scope above us
            var outerScope = node.findAbove(function(node) {
                if (node.scope) {
                    return node.scope;
                }
            });

            // Blocks create a new scope
            if (node.isBlock()) {
                node.scope = new Scope(node, outerScope, that);

            // Everything else inherits from their parent
            } else {
                node.scope = outerScope;
            }

        }, true);

        // Initialize the tree
        this.ast.visit(function(node, parent, depth) {
            node.init();
            //that.errors.push(new Error('Node failed to init "' + node.id + '"'));

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
            that.errors.push.apply(that.errors, node.getErrors());
            that.warnings.push.apply(that.errors, node.getWarnings());

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
    resolveImport: function(path) {

        var info = this.compiler.resolveModuleImport(path, this);

        // Resolve out the initial type of the export
        var type = info.module.resolveExportType(info.path[0]);

        // Now resolve any further properties on the type
        for(var i = 1, l = info.path.length; i < l; i++) {
            type = type.getPropertyType(info.path[i]);
        }
        info.type = type;

        return info;

    },


    // Export -----------------------------------------------------------------
    defineExport: function(name, type) {

        if (name === '*') {

            if (this.exports.length) {
                throw new TypeError('Module already exports other names.');

            } else if (this.exportType !== this.baseExportType) {
                throw new TypeError('Module already exports a global.');

            } else {
                console.log('OVERRIDEING GLOBAL EXPORT TYPE');
                this.exportType = type;
            }

        } else if (this.exportType.hasProperty(name)) {
            throw new TypeError('Module already exports "' + name + '".');

        } else if (this.exportType !== this.baseExportType) {
            throw new TypeError('Module already exports a global, cannot define propeties on it.');

        } else {
            this.exportType.defineProperty(name, type, '$1.$2');
        }

    },

    resolveExportType: function(name) {

        if (name === '*') {
            return this.exportType;

        } else if (this.exportType.hasProperty(name)) {
            return this.exportType.getPropertyType(name);

        } else {
            throw new TypeError('Module ' + this.getName() + ' does not export "' + name + '".');
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

