var Token = require('./Token').Token;

// Emblem Lexer ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Lexer = function(source, tokens, macros) {

    var line = 0,
        col = 0,
        offset = 0,
        rules = null,
        current = null;

    // Setup ------------------------------------------------------------------
    function parseSource(source) {

        // Remove shebang
        if (source.substring(0, 2) === '#!') {
            line = 1;
            return source.substring(source.indexOf('\n') + 1);

        } else {
            return source;
        }

    }

    function compileRules(tokens, macros) {
        return tokens.map(function(token) {

            for(var i in macros) {
                if (macros.hasOwnProperty(i)) {
                    var exp = new RegExp('{' + i + '}', 'g');
                    token[0] = token[0].replace(exp, macros[i]);
                }
            }

            return [new RegExp('^' + token[0]), token[1]];

        });
    }

    // Initialization ---------------------------------------------------------
    rules = compileRules(tokens, macros);
    source = parseSource(source);


    // Tokenization -----------------------------------------------------------
    var tokensSinceNewline = 0;
    function nextToken(allowNewline) {
        while((current = matchToken())) {

            if (current.id === 'NEWLINE') {
                tokensSinceNewline = 0;
            }

            if (current.id !== 'WHITESPACE' &&
                current.id !== 'NEWLINE' &&
                current.id !== 'LINE_COMMENT') {

                tokensSinceNewline++;
                break;
            }

        }
    }

    function matchToken() {

        var token = null,
            text = '',
            id = '',
            subtext = source.substring(offset),
            match = matchFirstRule(subtext),
            loc = getTokenLocation(text);

        if (match) {

            var tokenName = match.rule;
            text = match[0];
            loc = getTokenLocation(text);

            // Create token from available match
            id = tokenName && typeof tokenName === 'string' ? tokenName : text;
            token = new Token(id, text, loc);
            if (typeof tokenName === 'function') {
                tokenName(token);
            }

            // Update location
            offset = offset + match.index + text.length;
            line = loc.line[1] - 1;
            col = loc.col[1] - 1;

            if (id === 'NEWLINE') {
                col = 0;
            }

        } else if (subtext.length) {
            text = subtext.substring(0, 1);
            token = new Token('UNKNOWN', text, loc);

        } else {
            token = new Token('END', '', loc);
        }

        return token;

    }

    function getTokenLocation(text) {

        var textLines = text.split(/\r\n|\r|\n/),
            lineCount = textLines.length - 1,
            currentLine = textLines[textLines.length - 1],
            endLine = line + lineCount,
            endCol = lineCount > 1 ? currentLine.length
                                   : col + currentLine.length;

        return {
            line: [line + 1, endLine + 1],
            col: [col + 1, endCol + 1]
        };

    }

    function matchFirstRule(text) {

        // Go through all the regular expressions and find the first one that
        // matches from the start of the text
        var match = null;
        for(var i = 0, l = rules.length; i < l; i++) {
            var rule = rules[i];
            match = text.match(rule[0]);
            if (match) {
                match.rule = rule[1];
                break;
            }
        }

        return match;

    }

    function error() {

        var name = current.id;
        if (current.value !== current.id) {
            name = current.id + ' "' + current.value + '"';
        }

        var pos = ' at line ' + current.loc.line[0] +
                  ', column ' + current.loc.col[0] + '. ';

        if (current.id === 'UNKNOWN') {
            return 'Unknown symbol "' + current.value + '" ' + pos;

        } else {
            return 'Unexpected ' + name + pos;
        }

    }

    // Public Interface -------------------------------------------------------
    var options = [];
    nextToken();
    return {

        advance: function() {
            var token = current;
            nextToken();
            return token;
        },

        get: function() {
            return current;
        },

        match: function(type) {

            if (current.is(type)) {
                options.length = 0;
                return current;

            } else {
                options.push(type);
                return false;
            }

        },

        expectNewline: function() {
            if (tokensSinceNewline !== 1)  {
                throw new Error(error() + ' Expected a line break.');
            }
        },

        expect: function(type) {

            if (!current.is(type)) {
                throw new Error(error() + ' Expected ' + type);
            }

            var token = current;
            nextToken();
            return token;

        },

        fail: function(reason) {
            reason = reason || 'Tokens';
            reason = 'Expected one of the following ' + reason;
            throw new Error(error() + ' ' + reason + ': ' + options.join(', '));
        }

    };

};

exports.Lexer = Lexer;

