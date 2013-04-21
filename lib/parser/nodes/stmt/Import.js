var Node = require('../Node');

Node.Statement('Import', function(path, alias) {
    this.path = path;
    this.alias = alias;

    this.imports = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.path, visitor, depth, fromTop);
        this.alias && this.alias.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        var info = this.scope.resolveImport(this.path, this.alias);
        this.scope.defineName(info.name, info.type);
        this.imports = info.path;
        return true;
    },

    toString: function() {

        // TODO use the correct property get templates here

        //var imports = this.map(this.imports, function(im) {
            ////var moduleName =
            //return 'var ' + im.alias.toString() + ' = __modules[];';
        //});

        return ''; //this.toLineBlock(1, imports);

    }

});

