// Emblem Language Grammar ----------------------------------------------------
// ----------------------------------------------------------------------------
var grammar = {

    Root: [
        '',
        'Expression'
    ],

    // Raw Values -------------------------------------------------------------
    Identifier: [
        ['IDENTIFIER',  'new Identifier($1)']
    ],

    Literal: [
        ['NULL',        'new Null()'],
        ['BOOL',        'new Bool($1)'],
        ['FLOAT',       'new Float($1)'],
        ['INTEGER',     'new Integer($1)']
    ],

    IndexableLiteral: [
        ['STRING',      'new String($1)']
    ],


    // Expressions ------------------------------------------------------------
    Expression: [
        'ArgumentExpression',
        'Assignment',
        'Value',
        'Call',
        'Operation',
        'Literal'
    ],

    ExpressionGroup: [
        ['( Expression )', '$$ = $2']
    ],


    // Functions --------------------------------------------------------------
    Call: [
        ['Value Arguments', 'new Call($1, $2)'],
        ['Call Arguments',  'new Call($1, $2)']
    ],

    Arguments: [
        ['( ArgList )', '$2'],
        ['( )',         '[]']
    ],

    ArgList: [
        ['ArgList , Arg', '$$ = $1.concat([$3]);'],
        ['Arg',           '[$1]']
    ],

    Arg: [
        'Expression',
        'Splat'
    ],

    Splat: [
        ['Expression ...', 'new Splat($1)']
    ],


    // Values and Groups ------------------------------------------------------
    // - indexable
    // - invocable
    // - assignable
    Value: [
        'Assignable',
        ['IndexableLiteral', 'new Value($1)'],
        ['ExpressionGroup',  'new Value($1, null, true)'], // wrap these in ()
        ['Range',            'new Value($1)'],
        'This'
    ],


    // Assignments ------------------------------------------------------------
    Assignment: [
        ['Assignable = Expression', 'new Assign($1, $3)']
    ],

    Assignable: [
        'AssignableValue'
        //'Array',
        //'Object'
    ],

    AssignableValue: [
        ['Identifier',    'new Value($1)'],

        // Need to watch out to return the former or chained accessors will break the parser :)
        ['Value Access',  '$1.add($2); $$ = $1'],
        ['Call Access',   'new Value($1, $2)'],
        'ThisProperty'
    ],


    // Math and Logic ---------------------------------------------------------
    Operation: [

        // ~a !a &a ^a
        ['UNARY Expression',               "new Op($1, $2)"],

        ['- Expression',                   "new Op('-', $2)", { prec: 'UNARY' }],
        ['+ Expression',                   "new Op('+', $2)", { prec: 'UNARY' }],
        ['-- AssignableValue',             "new Op('--', $2)"],
        ['++ AssignableValue',             "new Op('++', $2)"],
        ['AssignableValue --',             "new Op('--', $1, null, true)"],
        ['AssignableValue ++',             "new Op('++', $1, null, true)"],

        ['Expression + Expression',        "new Op('+', $1, $3)"],
        ['Expression - Expression',        "new Op('-', $1, $3)"],

        // a * 2 a / b a // b a ** b a & b
        ['Expression INFIX Expression',    "new Op($2, $1, $3)"],

        // a >> 2 a << 2 a >>> 2
        ['Expression SHIFT Expression',    "new Op($2, $1, $3)"],

        // a != b a == b
        ['Expression COMPARE Expression',  "new Op($2, $1, $3)"],

        // a && b a || b
        ['Expression LOGIC Expression',    "new Op($2, $1, $3)"],

        // a ? b : c
        // TODO does this work as expected? Or will it have the wrong associativity
        ['Expression ? Expression : Expression', "new Op('?', $1, $3)"],

        // a > b a <= b a >= b a <= c
        ['Expression RELATION Expression', "new Op($2, $1, $3)"],

        // a += b a *=b a /= b
        ['AssignableValue COMPOUND Expression', "new Assign($1, $3, $2.substr(0, 1))"]
    ],


    // Access / Iidex ---------------------------------------------------------
    Access: [
        ['. Identifier',  'new Access($2)'],
        'Index'
    ],

    Index: [
        ['[ IndexValue ]', '$$ = $2']
    ],

    IndexValue: [
        ['Expression',  'new Index($1)'],
        'Slice'
    ],


    // Ranges / Slices --------------------------------------------------------
    Range: [
        // TODO inclusive / exclusive?
        ['[ Expression .. Expression ]', 'new Range($2, $4)']
    ],

    Slice: [
        ['Expression : Expression', 'new Slice($1, $3)'], // from:to
        [': Expression',            'new Slice(null, $2)'], // START:to
        ['Expression :',            'new Slice($1, null)'], // from:END
        [':',                       'new Slice(null, null)'] // START:END
    ],


    // References -------------------------------------------------------------
    This: [
        ['@', 'new Value(new This())']
    ],

    ThisProperty: [
        ['@ Identifier', 'new Value(new This(), new Access($2))']
    ]

};


// Transform our grammer to keep the above dry
for(var key in grammar) {
    if (grammar.hasOwnProperty(key)) {

        var g = grammar[key];
        if (key === 'Root') {
            grammar[key] = g.map(function(rule) {
                return [rule, 'return $1;'];
            });

        } else {
            grammar[key] = g.map(function(rule) {

                if (rule instanceof Array) {

                    // Modify everything to set the current context token
                    // to a new instance of the given Node
                    // we also pass in the location as the first param of the constructor
                    var action = rule[1],
                        replaced = 0;

                    do {
                        // The loop is needed to handle nested node creations like new Node(new Bar(), new Foo())
                        replaced = 0;
                        action = action.replace(/new ([A-Z][a-z]+)\((.*?)\)/g, function(a, b, c) {
                            replaced++;
                            if (c.length)  {
                                return 'new yy.' + b + '(@0, ' + c + ')';

                            } else {
                                return 'new yy.' + b + '(@0)';
                            }

                        });

                    } while(replaced);

                    return [rule[0], '$$ = ' + action + ';', rule[2]];

                } else {
                    // Everything else will just return itself
                    return rule;
                }

            });

        }

    }
}

module.exports = grammar;

