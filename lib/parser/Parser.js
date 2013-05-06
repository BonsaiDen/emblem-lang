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
    var state = {
        inType: false,
        inStruct: false,
        inInterface: false,
        inLoop: false,
        inEach: false,
        inFunction: false,
        comment: null
    };


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

    function matchNewline() {
        return lexer.matchNewline();
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
            state.comment = parseDocComment(); // TODO attach to next node

        // Blocks and other Statements
        } else if (match('KEYWORD')) {
            stmt = parseStatement();

        // Type declarations
        } else if (match('TYPE') || match('MODIFIER')) {
            stmt = parseDeclaration(true, true, false);
            expectNewline();

        // End of block or source
        } else if (match('}') || match('END')) {
            return null;

        // Expressions
        } else {
            expr = parseExpression();
            expectNewline();
        }

        // TODO attach last comment
        return node.Line(expr, stmt);

    }

    function parseGenericList(open, close, callback) {
        expect(open);
        if (!match(close)) {
            while(true) {
                callback();
                if (!match(',')) {
                    break;

                } else {
                    advance();
                }
            }
        }
        expect(close);
    }

    function parseParenBlock(callback) {
        parseGenericList('(', ')', callback);
    }

    function parseBracketBlock(callback) {
        parseGenericList('[', ']', callback);
    }

    function parseCurlyBlock(callback) {
        parseGenericList('{', '}', callback);
    }

    function parseNameList() {
        var path = [parseIdenfitier()];
        while(match('.')) {
            advance();
            path.push(parseIdenfitier());
        }
        return path;
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

        } else if (match('try')) {
            stmt = parseTry();

        } else if (match('match')) {
            stmt = parseMatch();

        } else if (match('loop')) {
            stmt = parseLoop();

        } else if (match('each')) {
            stmt = parseEach();

        // Break Statements
        } else if (match('ret')) {
            stmt = parseReturn();

        } else if (match('leave')) {
            // parseLeave();
            if (!state.inLoop && !state.inEach) {
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

        //} else if (match('type')) {
            //stmt = parseComplexType();

        //} else if (match('interface')) {
            //stmt = parseInterface();
        }
        expectNewline();

        return stmt ? stmt : fail('Statement');

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


    // Blocks -----------------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseScope() {
        expect('scope');
        return node.Scope(parseBlock());
    }

    function parseTry() {

        expect('try');

        var tryBlock, exceptBlock, finallyBlock;

        tryBlock = parseBlock();
        if (match('except')) {
            advance();
            exceptBlock = parseBlock();
        }

        if (match('finally')) {
            advance();
            finallyBlock = parseBlock();
        }

        return node.Try(tryBlock, exceptBlock, finallyBlock);

    }


    // Conditionals -----------------------------------------------------------
    // ------------------------------------------------------------------------
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


    // Loops ------------------------------------------------------------------
    function parseLoop() {

        var condition, body;

        expect('loop');
        if (!match('{')) {
            condition = parseExpression();
        }

        var wasInLoop = state.inLoop;
        state.inLoop = true;
        body = parseBlock();
        state.inLoop = wasInLoop;

        return node.Loop(condition, body);

    }

    function parseEach() {

        expect('each');

        var keyType = parseType(false),
            keyName = parseIdenfitier(),
            valueType = null,
            valueName = null,
            expr = null,
            body = null;

        if (match(',')) {
            advance();
            valueType = parseType(false);
            valueName = parseIdenfitier();
        }

        expect('in');
        expr = parseExpression();

        var wasInEach = state.inEach;
        state.inEach = true;
        body = parseBlock();
        state.inEach = wasInEach;

        return node.Each(keyType, keyName, valueType, valueName, expr, body);

    }


    // Declarations -----------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseDeclaration(allowFunctions, allowValue, allowMember) {

        var typeDesc = parseType(allowMember),
            name = parseIdenfitier();

        // Function declaration
        if (allowFunctions && match('(')) {
            return parseFunction(name, typeDesc);

        // Variables
        } else if (!match('=')) {
            return node.Variable(typeDesc, name);

        } else if (allowValue && match('=')) {
            advance();
            return node.Variable(typeDesc, name, parseExpression());

        } else {
            // TODO throw correct error when functions or values are not allows
            fail();
        }

    }

    function parseFunction(name, returnType) {

        var params = [],
            body;

        parseParenBlock(function() {
            params.push(parseDeclaration(false, false, false));
        });

        var wasInFunction = state.inFunction;
        state.inFunction = true;
        body = parseBlock();
        state.inFunction = wasInFunction;

        return node.Function(returnType, name, body);

    }

    function parseReturn() {

        // TODO complain about outside of function here instead of in above code
        expect('ret');

        if (!state.inFunction) {
            fail(); // TODO Unexpected return outside of function body.
        }

        // check for newline
        if (matchNewline()) {
            return node.Return(null);

        } else {
            return node.Return(parseExpression());
        }

    }

    function parseStruct() {

        expect('struct');

        var name = parseIdenfitier(),
            extend = [],
            members = [];

        if (match('[')) {
            extend = parseBracketBlock(function() {
                extend.push(parseNameList());
            });
        }


        // TODO dry with similiar constructs
        var wasInStruct = state.inStruct;
        state.inStruct = true;
        parseCurlyBlock(function() {
            members.push(parseDeclaration(true, true));
        });
        state.inStruct = wasInStruct;

        return node.Struct(name);

    }


    // Type Description -------------------------------------------------------
    // ------------------------------------------------------------------------
    function parseType(allowMember) {

        var type = parseBasicType(allowMember);

        // Parse function signature
        if (match('(')) {

            var params = [];
            parseParenBlock(function() {
                // TODO optional keyword? or flag?
                params.push(parseBasicType(false));
            });

            return node.FunctionType(type, params);

        } else {
            if (type.name === 'void') {
                throw new Error('Invalid type void. Can only be used for function returns');
            }
            return type;
        }

    }

    function parseBasicType(isMember) {

        var itemType,
            keyType, valueType,
            modifier = isMember ? 2 : 0; // Members are all private by default

        if (isMember) {

            if (match('public')) {
                advance();
                modifier = 1;
            }

            if (match('static')) {
                advance();
                modifier |= 4;
            }

        }

        // Modifiers
        if (match('MODIFIER')) {

            if (match('mutable')) {
                advance();
                modifier |= 8;

            } else {
                fail('Modifiers');
            }

        }

        // TODO support user types

        // Primitives
        if (match('int') || match('float') || match('string') || match('bool')) {
            return node.Type(advance().value, null, modifier);

        // Containers
        } else if (match('list')) {

            advance();
            expect('[');

            itemType = parseBasicType(false);
            expect(']');

            return node.Type('list', [itemType], modifier);

        } else if (match('map')) {

            advance();
            expect('[');

            keyType = parseBasicType(false);
            expect(',');

            valueType = parseBasicType(false);
            expect(']');

            return node.Type('map', [keyType, valueType], modifier);

        // Void function returns
        } else if (match('void')) {

            advance();
            if ((modifier & 8) === 8) {
                throw new Error('void type cannot be mutable');
            }

            return node.Type('void', null, modifier);

        } else {
            fail('Types');
        }

    }


    // Primitives -------------------------------------------------------------
    // ------------------------------------------------------------------------
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
        // TODO dry
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

        var keyType = parseType(false),
            keyName = parseIdenfitier(),
            valueType = null,
            valueName = null,
            expr = null,
            as = null;

        if (match(',')) {
            advance();
            valueType = parseType(false);
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

        var entries = [],
            key,
            value;

        parseCurlyBlock(function() {
            key = parseKey();
            expect(':');
            value = parseExpression();
            entries.push(node.MapItem(key, value));
        });

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
                    // TODO finish arguments call thing
                    var args = [];
                    parseParenBlock(function() {
                        args.push(parseExpression());
                    });
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

        } else if (match('@')) {

            // TODO check if we're in a member function else FAIL
            if (!(state.inFunction && state.inType)) {
                throw new TypeError('@ not allowed outside a member function');
            }

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
                var type = parseBasicType(false);
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

