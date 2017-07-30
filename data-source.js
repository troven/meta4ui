var DataSource = function(opts) {
    var self = this;

    opts = opts || { idProperty: "_id" };
    this.debug = opts.debug || false;

    this.debug && console.log("Data-Source: %s -> %s", opts.id, opts.idProperty);

    var Index = function(data, idProperty) {
        var idx = {};
        if (!data) return idx;
        if (!idProperty) throw "Missing index id";

        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            var id = v[idProperty];
            idx[id] = v;
        }
        console.log("index: %s -> %o / %o", idProperty, idx, data);
        return idx;
    }

    return {
        items: [], idx: {}, length: 0,

        find: function(id) {
            if (this.idx[id]) return this.idx[id];
            return this.items[id] || false;
        },

        indexOf: function(id) {
            return this.idx[id] || id;
        },

        refresh: function(items) {
            self.debug && console.log("refresh: %s", opts.idProperty);
            items = items || [];
            if ( !Array.isArray(items) ) {
                console.warn("invalid array: %o", items);
                throw new Error("data-source 'items' of "+(typeof items)+" is not an array");
                // return;
            }

            this.idx = Index(items, opts.idProperty);
            this.items = items;
            this.length = items.length || 0;
            self.debug && console.log("refreshed: %o x %o items", this.items, this.length);
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
