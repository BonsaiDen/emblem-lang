var Node = require('../Node');

Node.Statement('Export', function(path, alias, asModule) {
    this.path = path;
    this.alias = alias || path[path.length - 1];
    this.asModule = !!asModule;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.path, visitor, depth, fromTop);
        this.alias && this.alias.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        var type = this.scope.resolveExportType(this.path),
            alias = this.asModule ? '*' : this.alias.toString(true);

        this.scope.defineExport(alias, type);
        return true;

    },

    toString: function() {

        var origin = this.scope.mapExport(this.path);
        if (this.asModule) {
            return '__globalExports = ' + origin + ';';

        } else {
            var alias = this.alias.toString(true);
            return '__exports["' + alias + '"] = ' + origin + ';';
        }

    }

});

