/*jshint evil: true*/
var nodes = {

    // Literals and Identifiers -----------------------------------------------
    Identifier: function(name) {
        this.type = 'Identifier';
        this.name = name;
    },

    Integer: function(value) {
        this.type = 'Integer';
        this.value = +value;
    },

    Float: function(value) {
        this.type = 'Float';
        this.value = +value;
    },

    Bool: function(value) {
        this.type = 'Bool';
        this.value = value === 'true';
    },

    String: function(value) {
        this.type = 'String';
        this.value = eval(value);
    },


    // Encapsulate Values -----------------------------------------------------
    Value: function(value, access) {

        this.type = 'Value';
        this.value = value;
        this.access = access ? [access] : [];

        var that = this;
        this.add = function(access) {
            that.access.push(access);
        };

    },


    // Operations and Assignments ---------------------------------------------
    Op: function(operator, left, right, postfix) {
        this.type = 'Operator';
        this.op = operator;
        this.left = left;
        this.right = right;
        this.isPostFix = !!postfix;
    },

    Assign: function(target, expr, operator) {
        this.type = 'Assign';
        this.expression = expr;
        this.operator = operator || '=';
    },

    Call: function(target, args) {
        this.type = 'Call';
        this.target = target;
        this.args = args;
    },

    This: function() {
        this.type = 'This';
    },


    // Ranges / Slices --------------------------------------------------------
    Access: function(property) {
        this.type = 'Access';
        this.property = property;
    },

    Range: function(from, to) {
        this.type = 'Range';
        this.from = from;
        this.to = to;
    },

    Slice: function(from, to) {
        this.type = 'Slice';
        this.from = from;
        this.to = to;
    },

    Index: function(key) {
        this.type = 'Index';
        this.key = key;
    },

    Splat: function(expr) {
        this.type = 'Splat';
        this.expression = expr;
    }

};

module.exports = nodes;

