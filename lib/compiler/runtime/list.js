/*global em*/
em.list = {

    plusItem: function(list, item) {
        var l = list.slice();
        l.push(item);
        return l;
    },

    plusList: function(list, other) {
        var l = list.slice();
        l.push.apply(l, other);
        return l;
    },

    plusAssignItem: function(list, item) {
        list.push(item);
        return list;
    },

    plusAssignList: function(list, other) {
        list.push.apply(list, other);
        return list;
    },

    slice: function(list, from, to) {
        // TODO Handle negative
    },

    sliceAssign: function(list, from, to, values) {
        list.splice(from, to - from, values);
        return values;
    }

};

