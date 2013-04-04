var fs = require('fs'),
    util = require('util'),
    jison = require('jison');

var lexer = require('./lib/lexer'),
    grammar = require('./lib/grammar'),
    operators = require('./lib/operators');

var gen = new jison.Generator({
    lex: lexer,
    bnf: grammar,
    operators: operators.reverse(),
    startSymbol: 'Root'
});

var source = gen.generateModule();
source += '\nvar nodes = require("./nodes");\nexports.parse = function(source) { var p = new parser.Parser(); p.yy = nodes; return p.parse(source);};';
fs.writeFileSync('lib/parser.js', source);

console.log('Generated Parser into "lib/parser.js"');


// Some simple tests
var Ast = require('./lib/Ast');

var source = 'l += foo.bar[2]((2 ** 2 // 2), foo, 4)';
var tree = new Ast(source);
console.log(util.inspect(tree.tree, false, 4));


console.log(tree.generate());

//var code = '~!(+true) + (-2) * (++e) / 5 * foo()[2..(1 - 3)] + @foo.bar[2 + 2] - (a ? b : c) // 2 + @ + a > b && c < d || 4 != 5 - foo(1, 2, 3, foo = 2 + 2, bla...)';

