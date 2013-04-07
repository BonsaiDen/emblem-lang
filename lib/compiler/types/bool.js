// Bool Type ------------------------------------------------------------------
// ----------------------------------------------------------------------------
var b = require('../Type').createPrimitive('bool');


// Casts ----------------------------------------------------------------------
b.defineCast('int', '($1 ? 1 : 0)');
b.defineCast('float', '($1 ? 1 : 0)');
b.defineCast('string', "($1 ? 'true' : 'false'");


// Operators ------------------------------------------------------------------
b.defineInfixOp('==', 'bool', 'bool', '$1 === $2');
b.defineInfixOp('!=', 'bool', 'bool', '$1 !== $2');

b.defineInfixOp('+', 'bool', 'int', '$1 + $2');
b.defineInfixOp('-', 'bool', 'int', '$1 - $2');
b.defineInfixOp('&&', 'bool', 'bool', '$1 && $2');
b.defineInfixOp('||', 'bool', 'bool', '$1 || $2');

b.defineUnaryOp('!', 'bool', '!$1');

