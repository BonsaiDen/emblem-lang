// Emblem Lexer Token ---------------------------------------------------------
// ----------------------------------------------------------------------------
var Token = function(id, value, loc) {
    this.id = id;
    this.value = value;
    this.loc = loc;
};

Token.prototype = {

    is: function(type) {
        if (type.toUpperCase() === type) {
            return this.id === type;

        } else {
            return this.value === type;
        }
    },

    toString: function() {
        return '[Token ' + this.id + ' at line '  + this.loc.line[0] + ', column ' + this.loc.col[0] + ']';
    }

};

exports.Token = Token;

