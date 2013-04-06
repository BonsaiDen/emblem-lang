// Bool Type ------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Type = require('./Type'),
    bool = Type('bool');

// Casts ----------------------------------------------------------------------
bool.defineCast('int', '($1 ? 1 : 0)');
bool.defineCast('float', '($1 ? 1 : 0)');
bool.defineCast('string', "($1 ? 'true' : 'false'");


// Operators ------------------------------------------------------------------
bool.defineUnaryOperator('!', 'bool', 'bool', '!$1');
bool.defineOperator('+', 'bool', 'int', '$1 + $2');
bool.defineOperator('-', 'bool', 'int', '$1 - $2');
bool.defineOperator('&&', 'bool', 'bool', '$1 && $2');
bool.defineOperator('||', 'bool', 'bool', '$1 || $2');

