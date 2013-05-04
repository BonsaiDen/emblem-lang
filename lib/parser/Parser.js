var nodes = require('./ast/nodes'),
    Ast = require('./ast/Ast'),
    rules = require('./lexer/rules'),
    Lexer = require('./lexer/Lexer').Lexer;


// Emblem Lexer ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Parser = function(source) {

    // Setup ------------------------------------------------------------------
    // ------------------------------------------------------------------------
    var lexer = Lexer(source, rules.tokens, rules.macros);

    // State ------------------------------------------------------------------
    var inType = false,
        inLoop = false,
        inEach = false,
        inFunction = false;


    // Wrap AST Nodes ---------------------------------------------------------
    var node = {};
    function wrapNode(i) {
        return function() {
            return new nodes[i](arguments);
        };
    }

    for(var i in nodes) {
        if (nodes.hasOwnProperty(i)) {
            node[i] = wrapNode(i);
        }
    }


    // Lexer Helper Functions -------------------------------------------------
    // ------------------------------------------------------------------------
    function advance() {
        return lexer.advance();
    }

    function match(type) {
        return lexer.match(type);
    }

    function expect(type) {
        return lexer.expect(type);
    }

    function expectNewline() {
        lexer.expectNewline();
    }

    function fail(reason) {
        lexer.fail(reason);
    }


    // Top Level Structures ---------------------------------------------------
    // ------------------------------------------------------------------------
    function parseRoot() {
        var root = match('END') ? null : parseBody();
        expect('END');
        return root;
    }

    function parseBody() {

        var lines = [],
            line;

        while((line = parseLine())) {
            if (!line.isEmpty()) {
                lines.push(line);
            }
        }

        return node.Body(lines);

    }

    function parseBlock() {

        var body;
        expect('{');

        if (!match('}')) {
            body = parseBody();

        } else {
            body = node.Body();
        }

        expect('}');
        return body;

    }

    function parseLine() {

        var stmt = null,
            expr = null;

        // Comments
        if (match('DOC_COMMENT')) {
            parseDocComment(); // TODO attach to next node

        // Blocks and other Statements
        } else if (match('KEYWORD')) {
            stmt = parseStatement();

        // Type declarations
        } else if (match('TYPE') || match('MODIFIER')) {
            stmt = parseTypeDeclaration();
            expectNewline();

        // End of block or source
        } else if (match('}') || match('END')) {
            return null;

        // Expressions
        } else {
            expr = parseExpression();
            expectNewline();
        }

        return node.Line(expr, stmt);

    }


    // Comments ---------------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseDocComment() {
        return node.Doc(expect('DOC_COMMENT').value);
    }


    // Statements -------------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseStatement() {

        // Block Statments
        var stmt = null;
        if (match('scope')) {
            stmt = parseScope();

        } else if (match('if')) {
            stmt = parseIf();

        } else if (match('match')) {
            stmt = parseMatch();

        } else if (match('loop')) {
            stmt = parseLoop();

        } else if (match('each')) {
            stmt = parseEach();

        // Break Statements
        } else if (match('ret')) {
            if (!inFunction) {
                fail(); // TODO Unexpected return outside of function body.
            }
            advance();
            stmt = parseReturn();

        } else if (match('leave')) {
            if (!inLoop && !inEach) {
                fail(); // TODO Unexpected leave outside of loop/each body.
            }
            advance();
            stmt = node.Leave();

        // Module Statments
        } else if (match('import')) {
            stmt = parseImport();

        } else if (match('export')) {
            stmt = parseExport();

        // Type Statements
        } else if (match('struct')) {
            stmt = parseStruct();

        } else if (match('type')) {
            stmt = parseComplexType();

        } else if (match('interface')) {
            stmt = parseInterface();
        }
        expectNewline();

        return stmt ? stmt : fail('Statement');

    }

    function parseScope() {
        expect('scope');
        return node.Scope(parseBlock());
    }

    function parseReturn() {
        return node.Return(parseExpression());
    }

    function parseIf() {

        expect('if');

        var condition = parseExpression(),
            block = parseBlock(),
            elifs = [],
            elseBlock = null;

        while (match('elif')) {
            advance();
            elifs.push(node.Elif(parseExpression(), parseBlock()));
        }

        if (match('else')) {
            advance();
            elseBlock = node.Else(parseBlock());
        }

        return node.If(condition, block, elifs, elseBlock);

    }

    function parseMatch() {

        expect('match');

        var expression = parseExpression(),
            cases = [];

        expect('{');
        while(match('case')) {
            advance();
            cases.push(node.MatchCase(parseExpression(), parseBlock()));
        }
        expect('}');

        return node.Match(expression, cases);

    }

    function parseLoop() {

        var condition, body;

        expect('loop');
        if (match('{')) {
            inLoop = true;
            body = parseBlock();
            inLoop = false;

        } else {
            condition = parseExpression();
            inLoop = true;
            body = parseBlock();
            inLoop = false;
        }

        return node.Loop(condition, body);

    }

    function parseEach() {

        expect('each');

        var keyType = parseTypeDesc(),
            keyName = parseIdenfitier(),
            valueType = null,
            valueName = null,
            expr = null,
            body = null;

        if (match(',')) {
            advance();
            valueType = parseTypeDesc();
            valueName = parseIdenfitier();
        }

        expect('in');
        expr = parseExpression();

        inEach = true;
        body = parseBlock();
        inEach = false;

        return node.Each(keyType, keyName, valueType, valueName, expr, body);

    }


    // Module Level -----------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseImport() {

        expect('import');

        var path = parseNameList(),
            name,
            from = [];

        if (match('as')) {
            advance();
            name = parseIdenfitier();
        }

        if (match('from')) {
            advance();
            from = parseNameList();
        }

        return node.Import(from.concat(path), name);

    }

    function parseExport() {

        expect('export');

        var path = parseNameList();
        if (match('as')) {
            advance();

            if (match('IDENTIFIER')) {
                return node.Export(path, parseIdenfitier());

            } else if (match('*')) {
                advance();
                return node.Export(path, null, true);

            } else {
                fail();
            }

        } else {
            return node.Export(path);
        }

    }

    function parseNameList() {

        var path = [parseIdenfitier()];
        while(match('.')) {
            advance();
            path.push(parseIdenfitier());
        }
        return path;

    }


    // Declarations -----------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseTypeDeclaration() {

        var typeDesc = parseTypeDesc(false);

        // Function signature only
        // TODO some places will not allow for full declartions and stuff...
        if (match('(')) {
            var params = parseFunctionSignature();
            //return node.Function(returnType, signature, null, null);

        } else {

            var name = parseIdenfitier();

            // Function declaration
            if (match('(')) {

                // actual function
                params = parseFunctionDeclaration();
                var body = parseBlock();

                // return type = typeDesc, params
                //return node.Function(returnType, signature, defaultValues, body);

            // TODO only non-empty / void types can be variables!!

            // Variables
            } else if (!match('=')) {
                return node.Variable(typeDesc, name);

            } else if (match('=')) {
                advance();
                return node.Variable(typeDesc, name, parseExpression());

            } else {
                fail();
            }

        }

    }

    function parseFunctionDeclaration() {
        expect('(');
        // TODO allow defaults
        expect(')');
    }

    function parseFunctionSignature() {
        expect('(');
        // TODO Allow optional modifier in types
        expect(')');
    }

    function parseStruct() {

        expect('struct');

        var name = parseIdenfitier(),
            extend = null,
            members = [];

        if (match('[')) {
            extend = parseExtendList();
        }

        expect('{');
        while(!match('}')) {
            members.push(parseTypeDeclaration());
        }
        expect('}');

        return node.Struct();

    }

    function parseExtendList() {

        expect('[');

        var list = [];
        while(true) {

            list.push(parseNameList());
            if (!match(',')) {
                break;

            } else {
                advance();
            }

        }

        expect(']');

        return list;

    }

    function parseComplexType() {
        expect('type');
    }

    function parseInterface() {
        expect('interface');
    }


    // Types ------------------------------------------------------------------
    function parseTypeDesc() {

        // TODO handle functions / methods
        if (inType) {

            var modifier = 1;

            if (match('public')) {
                advance();
                modifier = 1;

            } else if (match('private')) {
                modifier = 2;
            }

            if (match('static')) {
                advance();
                modifier |= 4;
            }

            // Others
            if (match('mutable')) {
                advance();
                modifier |= 8;
            }

            return node.TypeDesc(parseType(false, modifier));

        } else {
            return node.TypeDesc(parseType(true));
        }

    }

    function parseType(allowMutable, modifier) {

        modifier = modifier || 0;

        // Modifiers
        if (allowMutable && match('MODIFIER')) {

            if (match('mutable')) {
                advance();
                modifier |= 8;

            } else {
                fail('Modifiers');
            }

        }

        var itemType, keyType, valueType;
        if (match('int') || match('float') || match('string') || match('bool')) {
            return node.Type(advance().value, null, modifier);

        } else if (match('list')) {

            advance();
            expect('[');

            itemType = parseType(true);
            expect(']');

            return node.Type('list', [itemType], modifier);

        } else if (match('map')) {

            advance();
            expect('[');

            keyType = parseType(true);
            expect(',');

            valueType = parseType(true);
            expect(']');

            return node.Type('map', [keyType, valueType], modifier);

        } else {
            fail('Types');
        }

    }


    // Primitives -------------------------------------------------------------
    function parseIdenfitier() {
        return node.Identifier(expect('IDENTIFIER').value);
    }

    function parseHex() {
        return node.Integer(parseInt(expect('HEX').value, 16));
    }

    function parseInteger() {
        return node.Integer(parseInt(expect('INTEGER').value, 10));
    }

    function parseFloating() {
        return node.Float(parseFloat(expect('FLOAT').value));
    }

    function parseString(raw) {
        if (raw) {
            return node.RawString(expect('RAW_STRING').value);

        } else {
            return node.String(expect('STRING').value);
        }
    }

    function parseBool() {
        return node.Bool(expect('BOOL').value);
    }


    // Containers -------------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseListOrComprehension() {

        var value;
        expect('[');
        if (match('each')) {
            value = parseComprehension();

        } else {
            value = node.List(parseListItems());
        }
        expect(']');
        return value;

    }

    function parseComprehension() {

        expect('each');

        var keyType = parseTypeDesc(),
            keyName = parseIdenfitier(),
            valueType = null,
            valueName = null,
            expr = null,
            as = null;

        if (match(',')) {
            advance();
            valueType = parseTypeDesc();
            valueName = parseIdenfitier();
        }

        expect('in');
        expr = parseExpression();
        expect('as');
        as = parseExpression();

        return node.Comprehension(keyType, keyName, valueType, valueName, expr, as);

    }

    function parseListItems() {

        var items = [];
        if (!match(']')) {
            while(true) {
                items.push(node.ListItem(parseExpression()));
                if (!match(',')) {
                    break;

                } else {
                    advance();
                }
            }
        }

        return items;

    }

    function parseKey() {

        if (match('STRING')) {
            return parseString(false);

        } else if (match('RAW_STRING')) {
            return parseString(true);

        } else if (match('HEX')) {
            return parseHex();

        } else if (match('INTEGER')) {
            return parseInteger();

        } else {
            fail();
        }

    }

    function parseMap() {

        expect('{');

        var entries = [],
            key,
            value;

        if (!match('}')) {

            while(true) {

                key = parseKey();
                expect(':');
                value = parseExpression();
                entries.push(node.MapItem(key, value));

                if (!match(',')) {
                    break;

                } else {
                    advance();
                }

            }

        }

        expect('}');

        return node.Map(entries);

    }


    // Expressions ------------------------------------------------------------
    // ------------------------------------------------------------------------
    function matchBinaryOperator() {
        return match('+') || match('-') || match('*') ||
               match('..') || match('...') ||
               match('in') || match('is') || match('BINARY');
    }

    function binaryPrecedence(op) {
        switch(op) {

            case '..':
            case '...':
                return 1;

            case '||':
                return 2;

            case '&&':
                return 3;

            case '|':
                return 4;

            case '^':
                return 5;

            case '&':
                return 6;

            case '==':
            case '!=':
                return 7;

            case '<':
            case '>':
            case '<=':
            case '>=':
            case 'is':
                return 8;

            case '<<':
            case '>>':
            case '>>>':
            case 'in':
                return 9;

            case '+':
            case '-':
                return 10;

            case '*':
            case '/':
            case '//':
            case '%':
                return 11;

            case '**':
                return 12;

            default:
                return 0;

        }

    }

    function parseExpression() {

        var expr = parseSimpleExpression();

        // Parse Binary Expressions
        var stack = [expr],
            right, op, left, prec;

        // Same approach taken by Esprima, although modified to some extend
        while((op = matchBinaryOperator())) {

            prec = binaryPrecedence(op.value);

            // Make a binary expression from three topmost entries
            // 4 * 3 + 2
            //  Will combine the 4 * 3 on the top into one expression
            //  since the prec of + is <= the one of *

            // 4 + 2 * 3 will not touch the stack for the time being
            while(stack.length > 2 && prec <= stack[stack.length - 2].prec) {
                right = stack.pop();
                op = stack.pop().value;
                left = stack.pop();
                stack.push(node.Op(op, left, right));
            }

            // Parse the next operator and expression
            op = advance();
            op.prec = binaryPrecedence(op.value);
            stack.push(op);
            stack.push(parseSimpleExpression());

        }

        // Now we reduce the rest of the stack from left to right
        var i = stack.length - 1;
        expr = stack[i];
        while(i > 1) {
            expr = node.Op(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        // Ternary Operator
        if (match('?')) {

            var consequent, alternate;
            advance();
            consequent = parseExpression();
            advance(':');
            alternate = parseExpression();

            return node.Ternary(expr, consequent, alternate);

        } else {
            return expr;
        }

    }

    function parseSimpleExpression() {

        var expr = parseUnaryExpression();
        if (expr.id === 'Value') {

            var value = expr;
            while(true) {

                // Calls
                if (match('(')) {
                    // TODO finish
                    var args = parseArgumentList();
                    value = node.Call(value, args);

                // Index / Slice
                } else if (match('[')) {
                    value.addAccess(parseIndexOrSlice());

                // Member / Property access
                } else if (match('.')) {
                    advance();
                    value.addAccess(node.Member(parseIdenfitier()));

                } else {
                    break;
                }

            }

            // Assignments
            if (match('=')) {
                advance();
                return node.Assign(value, parseExpression(), '=');

            } else if (match('ASSIGN')) {
                var op = advance().value;
                op = op.substring(0, op.length - 1);
                return node.Assign(value, parseExpression(), op);
            }

        // TODO error in case of . [ ( about invalid left-hand value?
        }

        return expr;

    }

    function matchUnaryOperator() {
        return match('+') || match('-') || match('UNARY');
    }

    function parseUnaryExpression() {

        if (match('IDENTIFIER')) {
            return node.Value(parseIdenfitier());

        // TODO check if we're in a member function
        } else if (match('@')) {

            advance();
            if (match('IDENTIFIER')) {
                return node.Value(node.This(), node.Member(parseIdenfitier()));

            } else  {
                return node.Value(node.This());
            }

        // Primitives
        } else if (match('BOOL')) {
            return parseBool();

        } else if (match('FLOAT')) {
            return parseFloating();

        } else if (match('INTEGER')) {
            return parseInteger();

        } else if (match('HEX')) {
            return parseHex();

        } else if (match('STRING')) {
            return node.Value(parseString(false));

        } else if (match('RAW_STRING')) {
            return node.Value(parseString(true));

        // Grouped Expressions / Casts
        } else if (match('(')) {

            var expr;
            advance();
            if (match('MODIFIER') || match('TYPE')) {
                var type = parseType(false);
                expect(')');
                expr = node.Cast(type, parseSimpleExpression());

            } else {
                expr = node.Value(parseExpression(), null, true);
                expect(')');
            }

            return expr;

        // Lists / Comprehensions
        } else if (match('[')) {
            return parseListOrComprehension();

        // Maps
        } else if (match('{')) {
            return parseMap();

        // Unary Operators
        } else if (matchUnaryOperator()) {
            var operator = advance().value;
            return node.Op(operator, parseSimpleExpression());

        } else {
            fail('Expressions');
        }

    }

    function parseArgumentList() {

    }

    function parseIndexOrSlice() {

        var from = null,
            to = null;

        expect('[');

        // Slice with empty from
        if (match(':')) {
            advance();

            // With to
            if (!match(']')) {
                to = parseExpression();
            }

            expect(']');
            return node.Slice(from, to);

        // Slice or Index
        } else {

            from = parseExpression();

            // Index
            if (match(']')) {
                advance();
                return node.Index(from);

            // Slice
            } else {
                expect(':');

                // With to
                if (!match(']')) {
                    to = parseExpression();
                }

                expect(']');
                return node.Slice(from, to);

            }

        }

    }


    // Initialize -------------------------------------------------------------
    return parseRoot();

};

exports.parse = function(source, scope) {
    //return Parser(source);
    return new Ast(Parser(source), scope);
};

