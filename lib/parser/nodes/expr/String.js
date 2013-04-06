/*jshint evil: true */
var Node = require('../Node');

Node('String', function(value) {
    this.value = eval(value);

}, {

    init: function() {
        this.type = this.scope.resolveType('string');
    },

    //getType: function() {
        //// how to set all of this stuff?
        //return this.type || (this.type = this.scope.resolveType('string'));
    //},

    toString: function() {
        return "'" + this.value.replace(/'/g, "\\'") + "'";
    }
});

