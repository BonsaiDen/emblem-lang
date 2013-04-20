var Node = require('../Node');

Node.Statement('Import', function(names, from) {
    this.imports = names.map(function(name) {
        return {
            origin: from ? [from].concat(name[0]) : name[0],
            alias: name[1]
        };
    });

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.each(this.imports, function(im) {
            this.visitChildren(im.origin, visitor, depth, fromTop);
            im.alias.visit(visitor, this, depth + 1, fromTop);
        });
    },

    init: function() {

        this.each(this.imports, function(im) {

            console.log(' - ', im.origin.join('.'), 'as', '' + im.alias);

            var type = this.scope.mapImport(im.origin);
            this.scope.defineName(im.alias.toString(true), type);

        });

        return true;

    },

    toString: function() {

        var imports = this.map(this.imports, function(im) {
            //var moduleName =
            return 'var ' + im.alias.toString() + ' = __modules[];';
        });

        return this.toLineBlock(1, imports);

    }

});

