// Float Type -----------------------------------------------------------------
// ----------------------------------------------------------------------------
var Type = require('./Type'),
    floating = Type('float');


// Casts ----------------------------------------------------------------------
floating.defineCast('bool', 'Math.floor($1) !== 0');
floating.defineCast('int', 'Math.floor($1)');
floating.defineCast('string', "'' + $1");


// Operators ------------------------------------------------------------------
floating.defineOperator('+', 'float', 'float', '$1 + $2');
floating.defineOperator('-', 'float', 'float', '$1 - $2');
floating.defineOperator('*', 'float', 'float', '$1 + $2');
floating.defineOperator('**', 'float', 'float', 'Math.pow($1, $2)');
floating.defineOperator('/', 'float', 'float', '$1 - $2');
floating.defineOperator('//', 'float', 'float', 'Math.floor($1 - $2)');

floating.defineUnaryOperator('+', 'float', 'float', '+$1');
floating.defineUnaryOperator('-', 'float', 'float', '-$1');
floating.defineUnaryOperator('!', 'float', 'bool', '!$1');
floating.defineUnaryOperator('++', 'float', 'float', '++$1');
floating.defineUnaryOperator('--', 'float', 'float', '--$1');
floating.definePostfixOperator('++', 'float', 'float', '$1++');
floating.definePostfixOperator('--', 'float', 'float', '$1--');

