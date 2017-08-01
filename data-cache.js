var DataCache = function(key, store) {
    if (!key) throw new Error("No cache key");
    if (!window.JSON) throw new Error("No JSON");
    store = store || window.localStorage || false;
    if (!store) throw new Error("No [local] storage");

    var memcache = window._memcache || {};

    return {

        _now: 0,
        TTL:  5* (1000*60),

        set: function(value) {
            try {
                memcache[key]=value;
                store.setItem(key, JSON.stringify(value));
                this._now = Date.now();
            } catch (e) {
                console.warn("cache failed: %s -> %o", key, value);
            }
        },

        get: function() {
            if ( this._now + this.TTL >= Date.now() ) {
                return memcache[key] || JSON.parse(store.getItem(key));
            }
            this.clear();
            return false;
        },

        clear: function() {
            delete memcache[key];
            store.removeItem(key);
            this._now = 0;
        }
    };
}