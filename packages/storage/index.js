import "js-cookie";

const DEFAULT_EXPIRE = 365;
export default class Storage {
  constructor() {
    Object.defineProperty(this, "_session", {
      value: window.sessionStorage
    });
    Object.defineProperty(this, "_local", {
      value: window.localStorage
    });
    this.session = new Proxy(
      this.initObject("session"),
      this.autoBinding("session")
    );
    this.local = new Proxy(this.initObject("local"), this.autoBinding("local"));
    this.cookie = new Proxy(this.initCookie(), this.bindingCookie());
  }

  initCookie() {
    const self = {};
    Object.defineProperties(self, {
      expires: {
        value: DEFAULT_EXPIRE,
        writable: true
      },
      clear: {
        value: function clear() {
          window.document.cookie = "";
        }
      }
    });
    return self;
  }

  initObject(type) {
    const self = {};
    const _self = this[`_${type}`];
    Object.defineProperty(self, "clear", {
      value: function clear() {
        _self.clear();
      }
    });
    return self;
  }

  bindingCookie() {
    return {
      get() {
        const val = window.Cookies.get(key);
        return val;
      },
      set(self, prop, val) {
        if (val === null) {
          // !todo maybe support path
          window.Cookies.remove(prop);
        } else if (typeof val === "string") {
          window.Cookies.set(prop, val, { expires: self.expires });
        } else {
          const { value, ...rest } = val;
          window.Cookies.set(prop, value, { expires: self.expires, ...rest });
        }
        return true;
      }
    };
  }

  autoBinding(type) {
    const _self = this[`_${type}`];
    return {
      get(self, prop) {
        if (prop !== "clear") {
          return _self[prop];
        }
        return self[prop];
      },
      set(self, prop, val) {
        if (val !== null) {
          _self.setItem(prop, val);
        } else {
          _self.removeItem(prop);
        }
        return true;
      }
    };
  }
}
