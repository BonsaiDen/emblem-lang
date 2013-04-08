// String Type ----------------------------------------------------------------
// ----------------------------------------------------------------------------
var s = require('../Type').createPrimitive('string');


// Casts ----------------------------------------------------------------------
s.defineCast('bool', '!!$1.length');
s.defineCast('int', '+$1');
s.defineCast('float', '+$1');


// Operators ------------------------------------------------------------------
s.defineInfixOp('==', 'string', 'bool', '$1 === $2');
s.defineInfixOp('!=', 'string', 'bool', '$1 !== $2');

s.defineInfixOp('+', 'string', 'string', '$1 + $2');
s.defineInfixOp('*', 'int', 'string', '(new Array($2 + 1).join($1))');

s.defineUnaryOp('#', 'int', '$1.length');

s.defineIndexGet('int', 'string', '$1.charAt($2)');
s.defineIndexSet('int', 'string', 'string', '$1.charAt($2) = $3');
//s.defineIndexSetOp('int', 'string', 'string', '$1.charAt($2) += $3');
//s.defineSliceGetOp('int', 'int', Type.createList('string'), '$1.slice($2, $3)');
//s.defineSliceSetOp('int', 'int', Type.createList('string'), 'string', '$1.slice($2, $3)');

