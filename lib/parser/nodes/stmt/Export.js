var Node = require('../Node');

Node.Statement('Export', function(names, from) {
    this.names = names.map(function(name) {
        return {
            origin: from ? [from].concat(name[0]) : name[0],
            alias: name[1]
        };
    });

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        var that = this;
        this.names.forEach(function(name) {
            that.visitChildren(name.origin, visitor, depth, fromTop);
            name.alias.visit(visitor, that, depth + 1, fromTop);
        });
    },

    init: function() {
        var that = this;
        this.names.forEach(function(name) {
            that.scope.defineExport(name.alias.toString(true),
                                    that.scope.resolveExportType(name.origin));
        });
    },

    toString: function() {

        var that = this,
            exports = this.names.map(function(name) {
                return '__exports["'
                        + name.alias.toString(true) +
                        '"] = ' + that.scope.mapExport(name.origin) + ';';
            });

        return this.toLineBlock(1, exports);

    }

});


