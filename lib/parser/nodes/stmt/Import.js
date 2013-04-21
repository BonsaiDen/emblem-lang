var Node = require('../Node');

Node.Statement('Import', function(path, alias) {
    this.path = path;
    this.alias = alias;

    this.imports = null;
    this.name = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.path, visitor, depth, fromTop);
        this.alias && this.alias.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        var info = this.scope.resolveImport(this.path, this.alias);
        this.scope.defineName(info.name, info.type);

        this.name = info.name;
        this.imports = info.path;
        return true;
    },

    toString: function() {

        // TODO use the correct property get templates here
        // get initial type
        // resolved all other property lookups

        // = __modules[];';
        return 'var ' + this.scope.mapName(this.name) + ' = ;';

    }

});

