var fs = require('fs'),
    util = require('util');

// Emblem Dependencies --------------------------------------------------------
var Scope = require('./Scope'),
    Ast = require('../parser/Ast');


// Emblem Module --------------------------------------------------------------
// ----------------------------------------------------------------------------
var Module = function(compiler, parent, name, path) {

    console.log('Module', name);

    this.compiler = compiler;
    this.parent = parent;
    this.name = name;
    this.path = path;
    this.source = null;

    this.scope = new Scope(null, null);

    this.imports = {};
    this.exports = {};
    this.ast = null;

};

Module.prototype = {

    compile: function() {

        // Create AST from source
        this.source = fs.readFileSync(this.path, 'utf8').toString();
        this.ast = new Ast(this.source, this.scope);

        // Add scope objects to tree and initialize the nodes fully
        this.ast.visit(function(node, parent, depth) {

            // Find the next scope above us
            var outerScope = node.findAbove(function(node) {
                if (node.scope) {
                    return node.scope;
                }
            });

            // Blocks create a new scope
            if (node.block) {
                node.scope = new Scope(node, outerScope);

            // Everything else inherits from their parent
            } else {
                node.scope = outerScope;
            }

            // Initializes types and performs things like imports
            // and exports, class type definitions, variable definitions
            node.init();

        }, true);

        // Validate tree
        this.ast.visit(function(node, parent, depth) {
            node.getType(); // should not be null

        }, true);

        //console.log(util.inspect(this.ast, false, 10));

        // Validate the tree???


        //this.ast.visit(function(node, parent, depth) {
            //console.log(new Array(depth * 4).join(' '), ' -', node.id, '=>', node.toString());
        //}, true);

        console.log(this.ast.toString());

        return true;

    },

    toString: function() {
        // generate all user types, encapsulate the module in a wrapper
        // global support functions (TODO later on, only generate required stuff to keep run time small)
        return this.ast.toString();
    }

};

module.exports = Module;

