// Emblem Lexer Definitions ---------------------------------------------------
// ----------------------------------------------------------------------------
var macros = {
    digit: '[0-9]',
    ident: '[a-zA-Z_]([a-zA-Z_0-9]+)?',
    esc: '\\\\',
    'int': '-?(?:[0-9]|[1-9][0-9]+)',
    exp: '(?:[eE][-+]?[0-9]+)',
    frac: '(?:\\.[0-9]+)'
};

var rules = [

    // Whitespace
    ['\\n+', 'NEWLINE'], // TODO handle line continuation characters here
    ['[\\ \\t]+', ''],

    // Literals
    ['{int}{exp}?\\b', 'INTEGER'],
    ['{int}{frac}?{exp}?\\b', 'FLOAT'],
    ["'(?:{esc}['bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^'{esc}])*'", "yytext = yytext.substr(1, yyleng - 2); return 'STRING';"],

    ['true\\b', 'BOOL'],
    ['false\\b', 'BOOL'],
    ['null\\b', 'NULL'],

    // Block Statements
    ['scope\\b', 'SCOPE'],

    // Identifiers
    ['{ident}\\b', 'IDENTIFIER'],

    // Parenthesis
    ['\\('],
    ['\\)'],
    ['\\{'],
    ['\\}'],
    ['\\['],
    ['\\]'],

    // Basic punctiation
    ['\\.\\.\\.'],
    ['\\.\\.'],
    ['\\.'],
    ['\\,'],
    ['\\:'],
    ['\\@'],
    ['\\?'],
    ['\\='],

    // Compound assignments
    ['\\&\\=', 'COMPOUND'],
    ['\\~\\=', 'COMPOUND'],
    ['\\^\\=', 'COMPOUND'],
    ['\\+\\=', 'COMPOUND'],
    ['\\-\\=', 'COMPOUND'],
    ['\\/\\/\\=', 'COMPOUND'],
    ['\\/\\=', 'COMPOUND'],
    ['\\*\\*\\=', 'COMPOUND'],
    ['\\*\\=', 'COMPOUND'],
    ['\\%\\=', 'COMPOUND'],
    ['\\|\\|\\=', 'COMPOUND'],
    ['\\&\\&\\=', 'COMPOUND'],

    // Shift Operators
    ['\\>\\>', 'SHIFT'],
    ['\\<\\<', 'SHIFT'],
    ['\\>\\>\\>', 'SHIFT'],

    // Relational Operators
    ['\\>', 'RELATION'],
    ['\\>\\=', 'RELATION'],
    ['\\<', 'RELATION'],
    ['\\<\\=', 'RELATION'],

    // Compare Operators
    ['\\!\\=', 'COMPARE'],
    ['\\=\\=', 'COMPARE'],

    // Logical Operators
    ['\\&\\&', 'LOGIC'],
    ['\\|\\|', 'LOGIC'],

    // Infix Operators
    ['\\/\\/', 'INFIX'],
    ['\\/', 'INFIX'],
    ['\\*\\*', 'INFIX'],
    ['\\*', 'INFIX'],
    ['\\|', 'INFIX'],
    ['\\%', 'INFIX'],
    ['\\^', 'INFIX'],
    ['\\&', 'INFIX'],

    // Unary Operators
    ['\\+\\+'],
    ['\\-\\-'],
    ['\\+'],
    ['\\-'],
    ['\\!', 'UNARY'],
    ['\\~', 'UNARY']

].map(function(tok) {

    if (tok.length === 1) {
        tok.push('return "' + tok[0].replace(/\\/g, '') + '";');

    } else if (tok[1] !== '' && tok[1].indexOf(';') === -1) {
        tok[1] = 'return "' + tok[1] + '";';
    }

    return tok;

});

module.exports = {
    macros: macros,
    rules: rules
};

