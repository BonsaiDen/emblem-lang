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
    ["[\\s]+", "/* skip whitespace */"],

    // Literals
    ["{int}{exp}?\\b", "return 'INTEGER';"],
    ["{int}{frac}?{exp}?\\b", "return 'FLOAT';"],
    ["'(?:{esc}['bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^'{esc}])*'", "yytext = yytext.substr(1, yyleng - 2); return 'STRING';"],

    ["true\\b", "return 'BOOL'"],
    ["false\\b", "return 'BOOL'"],
    ["null\\b", "return 'NULL'"],

    // Identifiers
    ["{ident}\\b", "return 'IDENTIFIER';"],

    // Parenthesis
    ["\\(", "return '('"],
    ["\\)", "return ')'"],
    ["\\{", "return '{'"],
    ["\\}", "return '}'"],
    ["\\[", "return '['"],
    ["\\]", "return ']'"],

    // Basic punctiation
    ["\\.\\.\\.", "return '...'"],
    ["\\.\\.", "return '..'"],
    ["\\.", "return '.'"],
    ["\\,", "return ','"],
    ["\\:", "return ':'"],
    ["\\@", "return '@'"],
    ["\\?", "return '?'"],
    ["\\=", "return '='"],

    // Compound assignments
    ["\\&\\=", "return 'COMPOUND'"],
    ["\\~\\=", "return 'COMPOUND'"],
    ["\\^\\=", "return 'COMPOUND'"],
    ["\\+\\=", "return 'COMPOUND'"],
    ["\\-\\=", "return 'COMPOUND'"],
    ["\\/\\/\\=", "return 'COMPOUND'"],
    ["\\/\\=", "return 'COMPOUND'"],
    ["\\*\\*\\=", "return 'COMPOUND'"],
    ["\\*\\=", "return 'COMPOUND'"],
    ["\\%\\=", "return 'COMPOUND'"],
    ["\\|\\|\\=", "return 'COMPOUND'"],
    ["\\&\\&\\=", "return 'COMPOUND'"],

    // Shift Operators
    ["\\>\\>", "return 'SHIFT'"],
    ["\\<\\<", "return 'SHIFT'"],
    ["\\>\\>\\>", "return 'SHIFT'"],

    // Relational Operators
    ["\\>", "return 'RELATION'"],
    ["\\>\\=", "return 'RELATION'"],
    ["\\<", "return 'RELATION'"],
    ["\\<\\=", "return 'RELATION'"],

    // Compare Operators
    ["\\!\\=", "return 'COMPARE'"],
    ["\\=\\=", "return 'COMPARE'"],

    // Logical Operators
    ["\\&\\&", "return 'LOGIC'"],
    ["\\|\\|", "return 'LOGIC'"],

    // Infix Operators
    ["\\/\\/", "return 'INFIX'"],
    ["\\/", "return 'INFIX'"],
    ["\\*\\*", "return 'INFIX'"],
    ["\\*", "return 'INFIX'"],
    ["\\|", "return 'INFIX'"],
    ["\\%", "return 'INFIX'"],
    ["\\^", "return 'INFIX'"],
    ["\\&", "return 'INFIX'"],

    // Unary Operators
    ["\\+\\+", "return '++'"],
    ["\\-\\-", "return '--'"],
    ["\\+", "return '+'"],
    ["\\-", "return '-'"],
    ["\\!", "return 'UNARY'"],
    ["\\~", "return 'UNARY'"]

];

module.exports = {
    macros: macros,
    rules: rules
};

