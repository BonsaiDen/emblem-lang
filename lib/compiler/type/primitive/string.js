// String Type ----------------------------------------------------------------
// ----------------------------------------------------------------------------
var s = require('../Type').createPrimitive('string');

// Defaults / Assignment ------------------------------------------------------
s.defineDefault("''");


// Assignments ----------------------------------------------------------------
s.defineAssignment('=', 'string', '$1 = $2');


// Casts ----------------------------------------------------------------------
s.defineCast('bool', '!!($1).length');
s.defineCast('int', 'parseInt($1, 10)');
s.defineCast('float', 'parseFloat($1)');


// Operators ------------------------------------------------------------------
s.defineInfixOp('==', 'string', 'bool', '$1 === $2');
s.defineInfixOp('!=', 'string', 'bool', '$1 !== $2');

s.defineInfixOp('+', 'string', 'string', '$1 + $2', true);
s.defineInfixOp('*', 'int', 'string', '(new Array($2 + 1).join($1))');

s.defineUnaryOp('#', 'int', '$1.length');

s.defineIndexGet('int', 'string', '$1.charAt($2)');
s.defineSliceGet('int', 'int', 'string', 'em.string.slice($1, $2, $3)');

