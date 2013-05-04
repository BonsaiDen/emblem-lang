// Int Type -------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Type = require('../Type'),
    i = Type.createPrimitive('int'),
    list = Type.createList(i);

// Default --------------------------------------------------------------------
i.defineDefault('0');


// Assignments ----------------------------------------------------------------
i.defineAssignment('=', 'int', '$1 = $2');


// Casts ----------------------------------------------------------------------
i.defineCast('bool', '(($1) !== 0)');
i.defineCast('float', '($1)');
i.defineCast('string', "('' + ($1))");


// Operators ------------------------------------------------------------------
i.defineInfixOp('==', 'int', 'bool', '$1 === $2');
i.defineInfixOp('!=', 'int', 'bool', '$1 !== $2');
i.defineInfixOp('<=', 'int', 'bool', '$1 <= $2');
i.defineInfixOp('>=', 'int', 'bool', '$1 >= $2');

i.defineInfixOp('<', 'int', 'bool', '$1 < $2');
i.defineInfixOp('>', 'int', 'bool', '$1 > $2');

i.defineInfixOp('+', 'int', 'int', '$1 + $2', true);
i.defineInfixOp('-', 'int', 'int', '$1 - $2', true);
i.defineInfixOp('*', 'int', 'int', '$1 * $2', true);
i.defineInfixOp('**', 'int', 'int', 'Math.floor(Math.pow($1, $2))', true, true);
i.defineInfixOp('/', 'int', 'int', 'Math.floor($1 / $2)', true, true);
i.defineInfixOp('%', 'int', 'int', '$1 % $2', true);

i.defineInfixOp('&', 'int', 'int', '$1 & $2', true);
i.defineInfixOp('|', 'int', 'int', '$1 | $2', true);
i.defineInfixOp('^', 'int', 'int', '$1 ^ $2', true);

i.defineInfixOp('..', 'int', list, 'em.range($1, $2, true)'); // Inclusive
i.defineInfixOp('...', 'int', list, 'em.range($1, $2, false)'); // Exclusive

i.defineUnaryOp('+', 'int', '+$1');
i.defineUnaryOp('-', 'int', '-$1');
i.defineUnaryOp('~', 'int', '~$1');
i.defineUnaryOp('!', 'bool', '!$1');

