var DataSource = function(opts) {
    opts = opts || { idProperty: "_key" };

    console.log("Data-Source: %s", opts.idProperty);

    var Index = function(data, idProperty) {
        var idx = {};
        if (!data) return idx;
        if (!idProperty) throw "Missing index id";

        for (var key in data) {
            var v = data[key];
            var id = v[idProperty];
            idx[id] = v;
        }
        return idx;
    }

    return {
        items: [],

        length: 0,

        find: function(id) {
            return this.idx[id] || this.items[id] || false;
        },

        refresh: function(items) {
            if (!items) {
                return;
            }
            if ( !Array.isArray(items) ) {
                return;
                // throw new Error("items is "+(typeof items)+" not an array");
            }

            this.idx = Index(items, opts.idProperty);
            this.items = items;
            this.length = items.length || 0;
        },

        sort: function(sort) {
//            console.log("pre-sort: %o -> %o -> %s", this.items, Array.isArray(this.items) , this.items.sort);
            return this.items.sort(function(a,b) {
                if(sort.direction == "desc"){
                    var c = a;
                    a = b;
                    b = c;
                }
                if(a[sort.property] > b[sort.property]) return 1;
                if(a[sort.property] < b[sort.property]) return -1;
                return 0;
            });
        },

        get: function(sorting, page, pageSize){
            var self = this;
            var items = self.items;
            return new Promise(function(resolve, reject){
                self.sort(sorting);
                resolve(self.items.slice((page-1)*pageSize, page*pageSize));
            });
        },

        set: function(item, property, value){
            var self = this;
            return new Promise(function(resolve, reject){
                if(!item.id || item.id === '__new__'){
                    var id = item.id || Math.round(Math.random() * 10000);
                    item.id = id;
                    self.idx[id]=item;
                    self.items.push(item);
                    resolve(id);
                } else {
                    var myItem = self.items.find(function(thisItem){
                        return thisItem.id == item.id;
                    });
                    myItem[property] = value;
                    resolve(true);
                }
            });

        }
    }
}
