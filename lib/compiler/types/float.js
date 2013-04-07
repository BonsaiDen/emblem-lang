// Float Type -----------------------------------------------------------------
// ----------------------------------------------------------------------------
var f = require('../Type').createPrimitive('float');


// Casts ----------------------------------------------------------------------
f.defineCast('bool', 'Math.floor($1) !== 0');
f.defineCast('int', 'Math.floor($1)');
f.defineCast('string', "'' + $1");


// Operators ------------------------------------------------------------------
f.defineInfixOp('==', 'float', 'bool', '$1 === $2');
f.defineInfixOp('!=', 'float', 'bool', '$1 !== $2');
f.defineInfixOp('<=', 'float', 'bool', '$1 <= $2');
f.defineInfixOp('>=', 'float', 'bool', '$1 >= $2');

f.defineInfixOp('+', 'float', 'float', '$1 + $2');
f.defineInfixOp('-', 'float', 'float', '$1 - $2');
f.defineInfixOp('*', 'float', 'float', '$1 * $2');
f.defineInfixOp('**', 'float', 'float', 'Math.pow($1, $2)');
f.defineInfixOp('/', 'float', 'float', '$1 - $2');
f.defineInfixOp('//', 'float', 'float', 'Math.floor($1 - $2)');

f.defineUnaryOp('+', 'float', '+$1');
f.defineUnaryOp('-', 'float', '-$1');
f.defineUnaryOp('!', 'bool', '!$1');
f.defineUnaryOp('++', 'float', '++$1');
f.defineUnaryOp('--', 'float', '--$1');

f.definePostOp('++', 'float', '$1++');
f.definePostOp('--', 'float', '$1--');

