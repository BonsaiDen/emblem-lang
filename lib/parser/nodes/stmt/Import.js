var Node = require('../Node');

Node.Statement('Import', function(names, from) {
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
            console.log(' - ', name.origin.join('.'), 'as', '' + name.alias);
            var type = that.scope.mapImport(name.origin);
            that.scope.defineName(name.alias.toString(true), type);
        });

        return true;
    },

    toString: function() {

        var that = this,
            imports = this.names.map(function(name) {
                //var moduleName =
                return 'var ' + name.alias.toString() + ' = __modules[];';
            });

        return this.toLineBlock(1, imports);

    }

});

