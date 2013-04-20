// Emblem Language Grammar ----------------------------------------------------
// ----------------------------------------------------------------------------
var grammar = {

    // Line / Body / Block
    Root: [
        '',
        'Body'
    ],

    Body: [
        ['Line',      'new Body($1)'],
        ['Body Line', '$1.addLine($2); $$ = $1']
    ],

    Block: [
        ['{ Body }', '$$ = $2'],
        ['{ }', '$$ = new Body()']
    ],

    Line: [
        'Comment',
        ['Expression ;', 'new Line($1, null)'],
        ['Statement',    'new Line(null, $1)']
    ],

    Comment: [
        ['LINE_COMMENT', 'new Comment($1)'],
        ['DOC_COMMENT',  'new Doc($1)']
    ],


    // Statements -------------------------------------------------------------
    Statement: [
        'Scope',
        'Variable',
        'Struct',
        'FunctionStmt',
        'ImportStmt',
        'ExportStmt'
    ],

    Scope: [
        ['SCOPE Block', 'new Scope($2)']
    ],

    Variable: [
        ['TypeDesc Identifier ;',              'new Variable($1, $2)'],
        ['TypeDesc Identifier = Expression ;', 'new Variable($1, $2, $4)']
    ],

    Struct: [
        ['TYPE_STRUCT Identifier StructLit ;',                'new Struct($2, $3)'],
        ['TYPE_STRUCT Identifier [ Identifier ] StructLit ;', 'new Struct($2, $4, $6)']
    ],


    // Import -----------------------------------------------------------------
    ImportStmt: [
        ['IMPORT IERefList ;',                 'new Import($2)'],
        ['FROM IEPath IMPORT IERefList ;',     'new Import($4, $2)'],
        ['FROM Identifier IMPORT IERefList ;', 'new Import($4, [$2])']
    ],

    ExportStmt: [
        ['EXPORT IERefList ;',   'new Export($2)'],
        ['EXPORT IEPath AS * ;', 'new Export($2, true)']
    ],

    IERefList: [
        ['IERef',             '[$1]'],
        ['IERefList , IERef', '$1.push.call($1, $3); $$ = $1']
    ],

    IERef: [
        ['IEPath AS Identifier',    '[$1,   $3]'],
        ['Identifier AS Identifier','[[$1], $3]'],
        ['Identifier',              '[[$1], $1]']
    ],

    IEPath: [
        ['Identifier .',      '[$1]'],
        ['IEPath Identifier', '$1.push.call($1, $2); $$ = $1'],
        ['IEPath Identifier .', '$1.push.call($1, $2); $$ = $1']
    ],


    // Functions Declarations / Expressions -----------------------------------
    FunctionStmt: [
        ['TypeDesc Identifier Parameters Block', 'new Function($1, $2, $3, $4)']
    ],

    Parameters: [
        ['( ParamList )', '$2'],
        ['( )',           '[]']
    ],

    ParamList: [
        ['ParamList , Param', '$$ = $1.concat($3);'],
        ['Param',             '[$1]']
    ],

    Param: [
        ['TypeDesc Identifier = Expression', 'new Param($1, $2, $4)'],
        ['TypeDesc Identifier',              'new Param($1, $2)']
    ],


    // Expressions ------------------------------------------------------------
    Expression: [
        'ArgumentExpression',
        'Assignment',
        'Value',
        'Call',
        'Operation',
        'BasicLit'
    ],

    ExpressionGroup: [
        ['( Expression )', '$$ = $2']
    ],


    // Raw Values -------------------------------------------------------------
    Identifier: [
        ['IDENTIFIER',  'new Identifier($1)']
    ],

    IndexLit: [
        ['INTEGER',    'new Integer($1)'],
        ['STRING',     'new String($1, false)'],
        ['RAW_STRING', 'new String($1, true)']
    ],

    BasicLit: [
        ['NULL',        'new Null()'],
        ['BOOL',        'new Bool($1)'],
        ['FLOAT',       'new Float($1)'],
        'IndexLit'
    ],

    ListLit: [
        ['[ ]',          'new List([])'],
        ['[ ListBody ]', 'new List($2)']
    ],

    ListBody: [
        ['ListItem',            '[$1]'],
        ['ListBody , ListItem', '$1.push($3); $$ = $1']
    ],

    ListItem: [
        ['Expression', 'new ListItem($1)']
    ],

    MapLit: [
        ['{ }',         'new Map([])'],
        ['{ MapBody }', 'new Map($2)']
    ],

    MapBody: [
        ['MapItem',           '[$1]'],
        ['MapBody , MapItem', '$1.push($3); $$ = $1']
    ],

    MapItem: [
        ['IndexLit : Expression', 'new MapItem($1, $3)']
    ],

    StructLit: [
        ['{ }', '$$ = null'],
        ['{ StructBody }', '$$ = $2']
    ],

    StructBody: [
        ['StructItem',              '[$1]'],
        ['StructBody , StructItem', '$1.push($3); $$ = $1']
    ],

    StructItem: [
        ['TypeDesc Identifier',              'new StructItem($1, $2)'],
        ['TypeDesc Identifier = Expression', 'new StructItem($1, $2, $4)']
    ],


    // Functions Calls --------------------------------------------------------
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

    // TODO splat args start with ...? (int ...foo) ?
    Splat: [
        ['... Expression', 'new Splat($1)']
    ],


    // Values and Groups ------------------------------------------------------
    // - indexable
    // - invocable
    // - assignable
    Value: [
        'Assignable',
        ['ListLit',         'new Value($1)'],
        ['MapLit',          'new Value($1)'],
        ['ExpressionGroup', 'new Value($1, null, true)'], // wrap these in ()
        ['Range',           'new Value($1)'],
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
        ['Value Access',  '$1.addAccess($2); $$ = $1'],
        ['Call Access',   'new Value($1, $2)'],
        'ThisProperty'
    ],


    // Math and Logic ---------------------------------------------------------
    Operation: [

        ['TypeCast Expression',            'new Cast($1, $2)', { prec: 'UNARY'}],

        // ~a !a &a ^a
        ['UNARY Expression',               'new Op($1, $2)'],

        ['- Expression',                   "new Op('-', $2)", { prec: 'UNARY' }],
        ['+ Expression',                   "new Op('+', $2)", { prec: 'UNARY' }],
        ['-- AssignableValue',             "new Op('--', $2)"],
        ['++ AssignableValue',             "new Op('++', $2)"],
        ['AssignableValue --',             "new Op('--', $1, null, true)"],
        ['AssignableValue ++',             "new Op('++', $1, null, true)"],

        ['Expression + Expression',        "new Op('+', $1, $3)"],
        ['Expression - Expression',        "new Op('-', $1, $3)"],

        // a * 2 a / b a // b a ** b a & b
        ['Expression INFIX Expression',    'new Op($2, $1, $3)'],

        // a >> 2 a << 2 a >>> 2
        ['Expression SHIFT Expression',    'new Op($2, $1, $3)'],

        // a && b a || b
        ['Expression LOGIC Expression',    'new Op($2, $1, $3)'],

        // a ? b : c
        // TODO does this work as expected? Or will it have the wrong associativity
        ['Expression ? Expression : Expression', "new Op('?', $1, $3)"],

        // a > b a <= b a >= b a <= c
        ['Expression RELATION Expression', 'new Op($2, $1, $3)'],

        // a += b a *=b a /= b
        ['AssignableValue COMPOUND Expression', 'new Assign($1, $3, $2.substr(0, 1))']
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
        ['[ Expression .. Expression ]',  'new Range($2, $4, true)'],
        ['[ Expression ... Expression ]', 'new Range($2, $4, false)']
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
    ],


    // Types ------------------------------------------------------------------
    BasicType: [
        'TYPE_PRIMITIVE'
    ],

    StructType: [
        'TYPE_STRUCT'
    ],

    Type: [

        // Containers
        ['TYPE_MAP [ Type , Type ]',   'new Type($1, [$3, $5])'],
        ['TYPE_LIST [ Type ]',         'new Type($1, [$3])'],
        ['TYPE_STRUCT [ Identifier ]', 'new Type($1, [$3])'],

        // Functions
        //'BasicType ( TypeList )',
        //'BasicType ( Type )',
        //'BasicType ( )',

        // Basics
        ['BasicType',                'new Type($1)']

        // Other things,
        //'Identifier'

    ],

    TypeModifier: [
        'MODIFIER_CONST'
    ],

    TypeModifierList: [
        ['TypeModifier'                 , '[$1]'],
        ['TypeModifierList TypeModifier', '$$ = $1.concat($2)']
    ],

    TypeDesc: [
        ['TypeModifierList Type', 'new TypeDesc($2, $1)'],
        ['Type',                  'new TypeDesc($1)']
    ],

    TypeList: [
        // Used in function types to describe their parameters
        'TypeDesc , TypeDesc',
        'TypeList , TypeDesc'
    ],

    TypeCast: [
        ['( TypeDesc )', '$$ = $2']
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
                        action = action.replace(/new ([A-Z][a-zA-Z]+)\((.*?)\)/g, function(a, b, c) {
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

