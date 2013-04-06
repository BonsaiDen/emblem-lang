// Float Type -----------------------------------------------------------------
// ----------------------------------------------------------------------------
var f = require('../Type').createPrimitive('float');


// Casts ----------------------------------------------------------------------
f.defineCast('bool', 'Math.floor($1) !== 0');
f.defineCast('int', 'Math.floor($1)');
f.defineCast('string', "'' + $1");


// Operators ------------------------------------------------------------------
f.defineOp('==', 'float', 'bool', '$1 === $2');
f.defineOp('!=', 'float', 'bool', '$1 !== $2');
f.defineOp('<=', 'float', 'bool', '$1 <= $2');
f.defineOp('>=', 'float', 'bool', '$1 >= $2');

f.defineOp('+', 'float', 'float', '$1 + $2');
f.defineOp('-', 'float', 'float', '$1 - $2');
f.defineOp('*', 'float', 'float', '$1 * $2');
f.defineOp('**', 'float', 'float', 'Math.pow($1, $2)');
f.defineOp('/', 'float', 'float', '$1 - $2');
f.defineOp('//', 'float', 'float', 'Math.floor($1 - $2)');

f.defineUnaryOp('+', 'float', '+$1');
f.defineUnaryOp('-', 'float', '-$1');
f.defineUnaryOp('!', 'bool', '!$1');
f.defineUnaryOp('++', 'float', '++$1');
f.defineUnaryOp('--', 'float', '--$1');

f.definePostOp('++', 'float', '$1++');
f.definePostOp('--', 'float', '$1--');

