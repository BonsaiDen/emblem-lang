// String Type ----------------------------------------------------------------
// ----------------------------------------------------------------------------
var Type = require('./Type'),
    string = Type('string');


// Casts ----------------------------------------------------------------------
string.defineCast('bool', '!!$1.length');
string.defineCast('int', '+$1');
string.defineCast('float', '+$1');


// Operators ------------------------------------------------------------------
string.defineOperator('+', 'string', 'string', '$1 + $2');
string.defineOperator('*', 'int', 'string', '(new Array($2 + 1).join($1))');

