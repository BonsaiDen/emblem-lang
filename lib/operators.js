var operators = [
    ['left',      '.', '?.'],
    ['left',      '(', ')'],
    ['nonassoc',  '++', '--'],
    ['left',      '?'],
    ['right',     'UNARY'],
    ['left',      'INFIX'],
    ['left',      '+', '-'],
    ['left',      'SHIFT'],
    ['left',      'RELATION'],
    ['left',      'COMPARE'],
    ['left',      'LOGIC'],
    ['right',     '=', ':', 'COMPOUND']
];

module.exports = operators;

