/*global em*/
em.map = {

    plusMap: function(map, other) {

        var m = {}, i;
        for(i in map) {
            if (map.hasOwnProperty(i)) {
                m[i] = map[i];
            }
        }

        for(i in other) {
            if (other.hasOwnProperty(i)) {
                m[i] = other[i];
            }
        }

        return m;

    },

    plusAssignMap: function(map, other) {

        for(var i in other) {
            if (other.hasOwnProperty(i)) {
                map[i] = other[i];
            }
        }

        return map;

    }

};

