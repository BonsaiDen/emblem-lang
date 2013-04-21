var Node = require('../Node');

Node.Statement('Export', function(names, globalExport) {
    this.exports = this.map(names, function(name) {
        return {
            origin: name[0],
            alias: globalExport ? null : name[1],
            globalExport: !!globalExport
        };
    });

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.each(this.exports, function(ex) {
            this.visitChildren(ex.origin, visitor, depth, fromTop);
            ex.alias && ex.alias.visit(visitor, this, depth + 1, fromTop);
        });
    },

    init: function() {

        this.each(this.exports, function(ex) {

            var type = this.scope.resolveExportType(ex.origin);
            if (ex.globalExport) {
                this.scope.defineExport('*', type);

            } else {
                this.scope.defineExport(ex.alias.toString(true), type);
            }

        });

        return true;

    },

    toString: function() {

        var exports = this.map(this.exports, function(ex) {

            var origin = this.scope.mapExport(ex.origin);
            if (ex.globalExport) {
                return '__globalExports = ' + origin + ';';

            } else {
                var alias = ex.alias.toString(true);
                return '__exports["' + alias + '"] = ' + origin + ';';
            }

        });

        return this.toLineBlock(1, exports);

    }

});

