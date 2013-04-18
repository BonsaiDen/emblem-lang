var fs = require('fs'),
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

var Compiler = require('./lib/compiler/Compiler');

var emblem = new Compiler();

// Test name resolving
emblem.getModule('modules.mod'); // File
emblem.getModule('modules.im'); // File

