var fs = require('fs'),
    util = require('util'),
    jison = require('jison');

var lexer = require('./lib/parser/bison/lexer'),
    grammar = require('./lib/parser/bison/grammar'),
    operators = require('./lib/parser/bison/operators');

var gen = new jison.Generator({
    lex: lexer,
    bnf: grammar,
    operators: operators.reverse(),
    startSymbol: 'Root'
});

var source = gen.generateModule();
source += '\nvar nodes = require("./nodes/all");\nexports.parse = function(source) { var p = new parser.Parser(); p.yy = nodes; return p.parse(source);};';
fs.writeFileSync('lib/parser/parser.generated.js', source);


// Test -----------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Some simple tests
var Ast = require('./lib/parser/Ast');

var source = 'l += (!foo.bar[2]((2 ** 2 // 2), foo, 4))[2:@foo]';
var tree = new Ast(source);
console.log(util.inspect(tree.tree, false, 10));

//console.log(tree.toString());

tree.visit(function(node, parent, depth) {
    console.log(new Array(depth * 4).join(' '), ' -', node.type, '=>', node.toString());

}, true);

//var code = '~!(+true) + (-2) * (++e) / 5 * foo()[2..(1 - 3)] + @foo.bar[2 + 2] - (a ? b : c) // 2 + @ + a > b && c < d || 4 != 5 - foo(1, 2, 3, foo = 2 + 2, bla...)';

