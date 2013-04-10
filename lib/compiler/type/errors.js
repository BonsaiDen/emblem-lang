// Compiler Errors ------------------------------------------------------------
// ----------------------------------------------------------------------------
var CompilerError = function(name, message) {
    this.node = null;
    this.name = name;
    this.message = message;
};

CompilerError.prototype = Error.prototype;
CompilerError.toString = function() {
    return '[' + this.name + '] ' + this.message;
};

function error(type, message) {
    return new CompilerError(type, message);
}

var err = {

    // Defaults and Assignments -----------------------------------------------
    Default: function(type) {
        return error('Value', type + ' has no default value.');
    },

    Assignment: function(type, op, to) {
        return error('Assignment', 'Unsupported assignment for: ' + type +' ' + op + ' ' + to);
    },


    // Operators --------------------------------------------------------------
    Operator: function(type, op) {
        return error('Operator', 'Unsupported ' + type + ' operation for: ' + op);
    },

    Infix: function(op, left, right) {
        return err.Operator('infix', left + ' ' + op + ' ' + right);
    },

    Unary: function(op, type) {
        return err.Operator('unary', op + type);
    },

    Postfix: function(op, type) {
        return err.Operator('postfix', type + op);
    },

    Prefix: function(op, type) {
        return err.Operator('prefix', op + type);
    },

    Index: function(index, type, assign) {
        var op = type + '[' + index + ']' + (assign ? '  = ' + assign : '');
        return error('Type', 'Unsupported index operation for: ' + op);
    },


    // Type Casts -------------------------------------------------------------
    Cast: function(type, to) {
        return new error('Type', 'Undefined cast for: (' + to + ')' + type);
    },


    // Properties (Structs, Primitives) ---------------------------------------
    GetterDefined: function(type, name) {
        return error('Property', 'Getter already defined for: ' + this + '.' + name);
    },

    SetterDefined: function(type, name) {
        return error('Property', 'Setter already defined for: ' + this + '.' + name);
    }

};

module.exports = err;

