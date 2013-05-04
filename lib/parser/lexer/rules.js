/*jshint evil: true */
exports.macros = {
    digit: '[0-9]',
    ident: '[a-zA-Z_]([a-zA-Z_0-9]+)?',
    esc: '\\\\',
    'int': '-?(?:[0-9]|[1-9][0-9]+)',
    hex: '-?(?:0x[0-9a-fA-F]+)',
    exp: '(?:[eE][-+]?[0-9]+)',
    frac: '(?:\\.[0-9]+)'
};

exports.tokens = [

    // Newline
    ['[\\n\\r]', 'NEWLINE'],

    // Whitespace
    ['[\\ \\t\\v]+', 'WHITESPACE'],

    // Literals
    ['{int}{frac}{exp}?\\b', 'FLOAT'],
    ['{int}{exp}?\\b', 'INTEGER'],
    ['{hex}\\b', 'HEX'],
    ['true\\b', 'BOOL'],
    ['false\\b', 'BOOL'],

    // Strings
    ["'(?:{esc}['bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^'{esc}])*'", function(token) {
        token.id = 'STRING';
        token.value = eval(token.value);
    }],

    // Raw Strings
    ["`(?:{esc}[`bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^`{esc}])*`", function(token) {
        token.id = 'RAW_STRING';
        token.value = token.value.substring(1, token.value.length - 1);
    }],

    // Doc Comments
    ['\\-\\-\\-[^]*?\\-\\-\\-', function(token) {
        token.id = 'DOC_COMMENT';
        token.value = token.value.substring(3, token.value.length - 3);
    }],

    // Line Comments
    ['\\-\\-[^\\-].*', function(token) {
        token.id = 'LINE_COMMENT';
        token.value = token.value.substring(2);
    }],

    // Types
    ['int\\b', 'TYPE'],
    ['float\\b', 'TYPE'],
    ['string\\b', 'TYPE'],
    ['bool\\b', 'TYPE'],
    ['list\\b', 'TYPE'],
    ['map\\b', 'TYPE'],
    ['struct\\b', 'TYPE'],
    ['void\\b', 'TYPE'],

    // Type Modifiers
    ['mutable\\b', 'MODIFIER'],
    ['static\\b', 'MODIFIER'],
    ['public\\b', 'MODIFIER'],
    ['private\\b', 'MODIFIER'],

    // Block Statements
    ['scope\\b', 'KEYWORD'],
    ['if\\b', 'KEYWORD'],
    ['elif\\b', 'KEYWORD'],
    ['else\\b', 'KEYWORD'],
    ['match\\b', 'KEYWORD'],
    ['case\\b', 'KEYWORD'],

    // Loop Statements
    ['loop\\b', 'KEYWORD'],
    ['each\\b', 'KEYWORD'],
    ['in\\b', 'KEYWORD'],

    // Breaking Statements
    ['ret\\b', 'KEYWORD'],
    ['leave\\b', 'KEYWORD'],
    ['yield\\b', 'KEYWORD'],

    // Types
    ['type\\b', 'KEYWORD'],
    ['interface\\b', 'KEYWORD'],
    ['is\\b', 'KEYWORD'],

    // Import / Export
    ['import\\b', 'KEYWORD'],
    ['from\\b', 'KEYWORD'],
    ['as\\b', 'KEYWORD'],
    ['export\\b', 'KEYWORD'],

    // Identifiers
    ['[a-zA-Z_]([a-zA-Z_0-9]+)?\\b', 'IDENTIFIER'],

    // Compound assignments
    ['\\&\\=', 'ASSIGN'],
    ['\\~\\=', 'ASSIGN'],
    ['\\^\\=', 'ASSIGN'],
    ['\\|\\=', 'ASSIGN'],
    ['\\+\\=', 'ASSIGN'],
    ['\\-\\=', 'ASSIGN'],
    ['\\%\\=', 'ASSIGN'],
    ['\\/\\/\\=', 'ASSIGN'],
    ['\\/\\=', 'ASSIGN'],
    ['\\*\\*\\=', 'ASSIGN'],
    ['\\*\\=', 'ASSIGN'],
    ['\\|\\|\\=', 'ASSIGN'],
    ['\\&\\&\\=', 'ASSIGN'],
    ['\\<\\<\\=', 'ASSIGN'],
    ['\\>\\>\\=', 'ASSIGN'],

    // Shift Operators
    ['\\>\\>\\>', 'BINARY'],
    ['\\>\\>', 'BINARY'],
    ['\\<\\<', 'BINARY'],

    // Relational Operators
    ['\\>\\=', 'BINARY'],
    ['\\<\\=', 'BINARY'],
    ['\\>', 'BINARY'],
    ['\\<', 'BINARY'],

    // Compare Operators
    ['\\!\\=', 'BINARY'],
    ['\\=\\=', 'BINARY'],

    // Logical Operators
    ['\\&\\&', 'BINARY'],
    ['\\|\\|', 'BINARY'],

    // Infix Operators
    ['\\/\\/', 'BINARY'],
    ['\\/', 'BINARY'],
    ['\\*\\*', 'BINARY'],
    ['\\*'],
    ['\\|', 'BINARY'],
    ['\\%', 'BINARY'],
    ['\\^', 'BINARY'],
    ['\\&', 'BINARY'],

    // Unary / Binary Operators
    ['\\+'],
    ['\\-'],

    // Unary Only Operators
    ['\\#', 'UNARY'],
    ['\\!', 'UNARY'],
    ['\\~', 'UNARY'],

    // Basic punctiation
    ['\\.\\.\\.'],
    ['\\.\\.'],
    ['\\.'],
    ['\\,'],
    ['\\:'],
    ['\\@'],
    ['\\?'],
    ['\\='],

    // Parenthesis
    ['\\('],
    ['\\)'],
    ['\\{'],
    ['\\}'],
    ['\\['],
    ['\\]']

];

