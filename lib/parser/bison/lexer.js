// Emblem Lexer Definitions ---------------------------------------------------
// ----------------------------------------------------------------------------
var macros = {
    digit: '[0-9]',
    ident: '[a-zA-Z_]([a-zA-Z_0-9]+)?',
    esc: '\\\\',
    'int': '-?(?:[0-9]|[1-9][0-9]+)',
    'hex': '-?(?:0x[0-9a-fA-F]+)',
    exp: '(?:[eE][-+]?[0-9]+)',
    frac: '(?:\\.[0-9]+)'
};

var rules = [

    // Whitespace
    ['[\\ \\t\\v\\n\\r]+', ''],

    // Literals
    ['{int}{frac}{exp}?\\b', 'FLOAT'],
    ['{int}{exp}?\\b', 'INTEGER'],
    ['{hex}\\b', 'HEX'],
    ["'(?:{esc}['bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^'{esc}])*'",
     'yytext = eval(yytext); return "STRING";'],

    ["`(?:{esc}[`bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^`{esc}])*`",
     'yytext = yytext.substring(1, yytext.length - 1); return "RAW_STRING";'],

    ['true\\b', 'BOOL'],
    ['false\\b', 'BOOL'],
    ['null\\b', 'NULL'],

    // Comments
    ['\\-\\-\\-[^]*?\\-\\-\\-', 'yytext = yytext.substring(3, yytext.length - 3); return "DOC_COMMENT";'],
    ['\\-\\-[^\\-].*', 'yytext = yytext.substring(2); return "LINE_COMMENT";'],

    // Block Statements
    ['scope\\b', 'SCOPE'],

    // Import / Export
    ['import\\b', 'IMPORT'],
    ['from\\b', 'FROM'],
    ['as\\b', 'AS'],
    ['export\\b', 'EXPORT'],

    // Types
    ['int\\b', 'TYPE_PRIMITIVE'],
    ['float\\b', 'TYPE_PRIMITIVE'],
    ['string\\b', 'TYPE_PRIMITIVE'],
    ['bool\\b', 'TYPE_PRIMITIVE'],

    ['list\\b', 'TYPE_LIST'],
    ['map\\b', 'TYPE_MAP'],
    ['struct\\b', 'TYPE_STRUCT'],

    //['void\\b', 'TYPE_VOID'],
    //['null\\b', 'TYPE_NULL'],
    //['var\\b', 'TYPE_VAR'],

    // Type Modifiers
    ['mutable\\b', 'MODIFIER_MUTABLE'],
    ['public\\b', 'MODIFIER_PUBLIC'],
    ['protected\\b', 'MODIFIER_PROTECTED'],
    ['private\\b', 'MODIFIER_PRIVATE'],

    // Identifiers
    ['{ident}\\b', 'IDENTIFIER'],

    // Parenthesis
    ['\\('],
    ['\\)'],
    ['\\{'],
    ['\\}'],
    ['\\['],
    ['\\]'],

    // Compound assignments
    ['\\&\\=', 'COMPOUND'],
    ['\\~\\=', 'COMPOUND'],
    ['\\^\\=', 'COMPOUND'],
    ['\\+\\=', 'COMPOUND'],
    ['\\-\\=', 'COMPOUND'],
    ['\\%\\=', 'COMPOUND'],
    ['\\/\\/\\=', 'COMPOUND'],
    ['\\/\\=', 'COMPOUND'],
    ['\\*\\*\\=', 'COMPOUND'],
    ['\\*\\=', 'COMPOUND'],
    ['\\|\\|\\=', 'COMPOUND'],
    ['\\&\\&\\=', 'COMPOUND'],
    ['\\<\\<\\=', 'COMPOUND'],
    ['\\>\\>\\=', 'COMPOUND'],

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
    ['\\!\\=', 'RELATION'],
    ['\\=\\=', 'RELATION'],

    // Logical Operators
    ['\\&\\&', 'LOGIC'],
    ['\\|\\|', 'LOGIC'],

    // Infix Operators
    ['\\/\\/', 'INFIX'],
    ['\\/', 'INFIX'],
    ['\\*\\*', 'INFIX'],
    ['\\*', 'INFIX_MUL'],
    ['\\|', 'INFIX'],
    ['\\%', 'INFIX'],
    ['\\^', 'INFIX'],
    ['\\&', 'INFIX'],

    // Unary Operators
    ['\\+'],
    ['\\-'],
    ['\\#', 'UNARY'],
    ['\\!', 'UNARY'],
    ['\\~', 'UNARY'],

    // Basic punctiation
    ['\\.\\.\\.'],
    ['\\.\\.'],
    ['\\.'],
    ['\\,'],
    ['\\:'],
    ['\\;'],
    ['\\@'],
    ['\\?'],
    ['\\=']

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

