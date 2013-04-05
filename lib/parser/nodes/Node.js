function extend(obj, props) {
    for(var p in props) {
        if (props.hasOwnProperty(p)) {
            obj[p] = props[p];
        }
    }
    return obj;
}


// Emblem AST Base Node -------------------------------------------------------
// ----------------------------------------------------------------------------
function AstNode(type, ctor, proto) {

    var node = function AstNode() {

        var args = Array.prototype.slice.call(arguments);
        this.type = type;
        this.parent = null;
        this.line = [args[0].first_line, args[0].last_line];
        this.col = [args[0].first_column, args[0].last_column];

        ctor.apply(this, args.slice(1));

    };

    // Setup the prototype of the new Node with some defaults
    // and the custom implementation
    node.prototype = extend({}, AstNode.prototype);
    extend(node.prototype, proto);

    // We wrap the visit function to reduce a lot of the code
    // that handles the traversal order of the tree
    var implementedVisit = node.prototype.visit;
    node.prototype.visit = function(visitor, parentNode, depth, fromTop) {

        if (fromTop) {
            visitor(this, parentNode, depth, fromTop);
            implementedVisit.call(this, visitor, parentNode, depth, fromTop);

        } else {
            implementedVisit.call(this, visitor, parentNode, depth, fromTop);
            visitor(this, parentNode, depth, fromTop);
        }

    };

    AstNode.map[type] = node;

    return node;

}

AstNode.map = {};

AstNode.prototype = {

    validate: function() {
        return true;
    },

    type: function() {
        return '<Unknown>';
    },

    visit: function() {
        //visitor(this, parentNode, depth, fromTop);
    },

    visitChildren: function(children, visitor, depth, fromTop) {
        var that = this;
        children.forEach(function(child) {
            child.visit(visitor, that, depth + 1, fromTop);
        });
    },

    toString: function() {
        return '<Node ' + this.type + '>';
    }

};

module.exports = AstNode;

