var fs = require('fs');

// Emblem Dependencies --------------------------------------------------------
var Scope = require('./Scope'),
    Ast = require('../parser/Ast');


// Emblem Module --------------------------------------------------------------
// ----------------------------------------------------------------------------
var Module = function(compiler, parent, name, path) {

    console.log('Module: ', name);

    this.compiler = compiler;
    this.parent = parent;
    this.name = name;
    this.path = path || null;

    this.errors = [];
    this.warnings = [];

    this.scope = new Scope(null, null);

    this.imports = {};
    this.exports = {};
    this.ast = null;

};

Module.prototype = {

    compile: function() {
        var source = fs.readFileSync(this.path, 'utf8').toString();
        return this.build(source);
    },

    compileFromSource: function(source, path) {
        this.path = path || this.path;
        return this.build(source);
    },

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
                node.scope = new Scope(node, outerScope);

            // Everything else inherits from their parent
            } else {
                node.scope = outerScope;
            }

        }, true);


        // Validate tree ------------------------------------------------------
        this.ast.visit(function(node, parent, depth) {

            node.init();
            if (node.isExpression()) {
                node.getType();
            }

        }, true);

        //this.ast.visit(function(node, parent, depth) {
            //console.log(new Array(depth * 4).join(' '), ' -', node.id, '=>', node.toString().replace(/\n/g, ' '));

        //}, true);

        console.log('Compiled in: %sms', Date.now() - start);

        if (this.validate()) {
            return this.generate();

        } else {
            return false;
        }

        // Collect Errors and Warnings ----------------------------------------
        //console.log(util.inspect(this.ast, false, 10));

    },

    generate: function() {

        var code;
        try {
            code = this.ast.toString();

        } catch(e) {
            this.errors.push(e);
        }

        console.log(code);
        return this.validate() ? code : null;

    },

    validate: function() {

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

    toString: function() {
        // generate all user types, encapsulate the module in a wrapper
        // global support functions (TODO later on, only generate required stuff to keep run time small)
        return this.ast.toString();
    }

};

module.exports = Module;

