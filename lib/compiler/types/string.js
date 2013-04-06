// String Type ----------------------------------------------------------------
// ----------------------------------------------------------------------------
var s = require('../Type').createPrimitive('string');


// Casts ----------------------------------------------------------------------
s.defineCast('bool', '!!$1.length');
s.defineCast('int', '+$1');
s.defineCast('float', '+$1');


// Operators ------------------------------------------------------------------
s.defineOp('==', 'string', 'bool', '$1 === $2');
s.defineOp('!=', 'string', 'bool', '$1 !== $2');

s.defineOp('+', 'string', 'string', '$1 + $2');
s.defineOp('*', 'int', 'string', '(new Array($2 + 1).join($1))');

