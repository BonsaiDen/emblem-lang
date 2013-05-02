// Emblem Language Operator Precedence ----------------------------------------
// ----------------------------------------------------------------------------
var operators = [
    ['left',      '.', '?.'],
    ['left',      '(', ')'],
    ['left',      '?'],
    ['right',     'UNARY'],
    ['left',      'INFIX', 'INFIX_MUL'], // TODO in operator
    ['left',      '+', '-'],
    ['left',      'SHIFT'],
    ['left',      'RELATION'],
    ['left',      'COMPARE'],
    ['left',      'LOGIC'],
    ['right',     '=', ':', 'COMPOUND']
];

module.exports = operators;

