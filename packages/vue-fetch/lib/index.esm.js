/*
 * library: @okvue/vue-fetch
 * version: 0.2.10
 * author: orlo wang <ow.cc@outlook.com>
 */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/*
 * FileSaver.js
 * A saveAs() FileSaver implementation.
 *
 * By Eli Grey, http://eligrey.com
 *
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 * source  : http://purl.eligrey.com/github/FileSaver.js
 */
// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
// `a.click()` doesn't work for all browsers (#465)
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}

function SaveAs(blob, name) {
  if ("download" in HTMLAnchorElement.prototype) {
    var a = document.createElement("a");
    name = name || blob.name || "download";
    a.download = name;
    a.rel = "noopener"; // tabnabbing
    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'
    // Support blobs

    a.href = URL.createObjectURL(blob);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 4e4); // 40s

    setTimeout(function () {
      click(a);
    }, 0);
  } else {
    var force = blob.type === "application/octet-stream";

    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;

    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if ((isChromeIOS || force && isSafari) && (typeof FileReader === "undefined" ? "undefined" : _typeof(FileReader)) === "object") {
      // Safari doesn't allow downloading of blob urls
      var reader = new FileReader();

      reader.onloadend = function () {
        var url = reader.result;
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        location = url;
      };

      reader.readAsDataURL(blob);
    } else {
      var url = URL.createObjectURL(blob);
      location.href = url;
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 4e4); // 40s
    }
  }
}

function toPrefixPath(path, prefix) {
  return prefix ? trim(prefix, "/") + "/" + trim(path, "/") : path;
}
function setApi(name, prefix) {
  return (prefix ? prefix + "_" : "") + name + "_status";
}
function parseStream(src, type, isStream) {
  if (isStream) {
    if (isStream.immediately) {
      // download
      return src.blob().then(function (blob) {
        return SaveAs(blob, isStream.filename);
      });
    } // stream

  } else {
    switch (true) {
      case /application\/x-www-form-urlencoded/.test(type):
      case /multipart\/form-data/.test(type):
        return src.formData();

      case /application\/json/.test(type):
        return src.json();

      case /video|audio|image|message|x-token/.test(type):
      case /text\/plain/.test(type):
      default:
        return src.text();
    }
  }
}
function trim(string, str) {
  if (!string) return "";

  if (!str) {
    return string.trim();
  } else if (/\//.test(str)) {
    return string.replace(new RegExp("^\\".concat(str, "+|\\").concat(str, "+$"), "g"), "");
  } else {
    return string.replace(new RegExp("^".concat(str, "+|").concat(str, "+$"), "g"), "");
  }
}
function toLower(str) {
  return str ? str.toLowerCase() : "";
}

var Vuefetch =
/*#__PURE__*/
function () {
  function Vuefetch(fetchConfig, Vuex, VueSet) {
    _classCallCheck(this, Vuefetch);

    this.count = 0;
    this.stateCount = new Map();
    this.storeCount = 0;
    this._lifeCycles = [];
    this._api_path = {};
    this._Vuex = Vuex;
    this._VueSet = VueSet;

    this._init(fetchConfig);
  }

  _createClass(Vuefetch, [{
    key: "_init",
    value: function _init(fetchConfig) {
      var _this = this;

      if (!fetchConfig) return;

      if (this._Vuex) {
        this._registerVuexBaseMutationsAndActions();
      }

      this._instance = new Map();

      if (Array.isArray(fetchConfig)) {
        fetchConfig.map(function (config, index) {
          var name = config.name,
              vuex = config.vuex,
              api = config.api,
              rest = _objectWithoutProperties(config, ["name", "vuex", "api"]);

          if (name) {
            _this._instance.set(name, [rest, vuex]);

            if (_this._Vuex && vuex && vuex.enable) {
              _this.stateCount.set(name, null);

              _this._registerVuexModule(api, vuex.restful, name);
            }

            if (index === 0) {
              _this._instance.set("default", [rest, vuex]);

              _this._api_path["default"] = api;
            }
          } else {
            throw Error("'name' fields in config is required");
          }
        });
      } else if (fetchConfig.name) {
        var name = fetchConfig.name,
            vuex = fetchConfig.vuex,
            api = fetchConfig.api,
            rest = _objectWithoutProperties(fetchConfig, ["name", "vuex", "api"]);

        this._instance.set("default", [rest, vuex]);

        this._api_path["default"] = api;

        if (this._Vuex && vuex && vuex.enable) {
          this.stateCount.set(name, null);

          this._registerVuexModule(api, vuex.restful, name);
        }
      } else {
        throw Error("'name' fields in config is required");
      }
    }
  }, {
    key: "_registerVuexBaseMutationsAndActions",
    value: function _registerVuexBaseMutationsAndActions() {
      this._Vuex.registerModule("_vf_base", {
        mutations: {
          vueFetchApiStatusUpdate: function vueFetchApiStatusUpdate(state, _ref) {
            var api = _ref.api,
                status = _ref.status;
            state[setApi(api)] = status;
          }
        },
        actions: {
          VUE_FETCH_API_STATUS_UPDATE: function VUE_FETCH_API_STATUS_UPDATE(_ref2, payload) {
            var commit = _ref2.commit;
            commit("vueFetchApiStatusUpdate", payload);
          }
        }
      });
    }
  }, {
    key: "_registerVuexModule",
    value: function _registerVuexModule(apis, useRestful, name) {
      var _this2 = this;

      if (!apis) return;
      var getters = {};
      this._api_path[name] = _objectSpread({}, this._api_path[name], apis);
      Object.keys(apis).map(function (api) {
        if (useRestful) {
          (useRestful === true ? ["post", "get", "delete", "put", "patch"] : useRestful).map(function (method) {
            var key = setApi(api, method); // TODO if there is a better way to set getters

            getters[key] = function (state, getters, rootState) {
              return rootState._vf_base[key];
            };

            _this2._VueSet(_this2._Vuex._modules.root.state._vf_base, key, "init");
          });
        } else {
          var key = setApi(api);

          getters[key] = function (state, getters, rootState) {
            return rootState._vf_base[key];
          };

          _this2._VueSet(_this2._Vuex._modules.root.state._vf_base, key, "init");
        }
      });
      var getModuleCount = this.stateCount.get(name) || 0;
      this.stateCount.set(name, ++getModuleCount);
      var moduleName = "_vf_".concat(name + getModuleCount);

      this._Vuex.registerModule(moduleName, {
        getters: getters
      });
    }
  }, {
    key: "_createNewLifeCycle",
    value: function _createNewLifeCycle(fetchConfig) {
      var count = this._lifeCycles[this.count] && this._lifeCycles[this.count][0] ? ++this.count : this.count;

      if (!this._lifeCycles[count]) {
        this._lifeCycles[count] = [undefined, undefined, undefined, undefined, undefined];
      }

      if (fetchConfig.path) this._lifeCycles[count][0] = fetchConfig.path;
      if (fetchConfig.domain) this._lifeCycles[count][1] = fetchConfig.domain || "default";
      if (fetchConfig.headers) this._lifeCycles[count][2] = fetchConfig.headers;
      if (fetchConfig.config) this._lifeCycles[count][3] = fetchConfig.config;
      if (fetchConfig.hooks) this._lifeCycles[count][4] = fetchConfig.hooks;
    }
  }, {
    key: "_doFetch",
    value: function _doFetch(dataOrParams, method, spec) {
      var _this3 = this;

      var current_life_cycle = this._lifeCycles[this.count];
      var current_domain = current_life_cycle[1] || "default";

      if (!this._instance.has(current_domain)) {
        throw Error("domain \"".concat(current_domain, "\" is unregistered"));
      }

      var real_path = this._api_path[current_domain] ? this._api_path[current_domain][current_life_cycle[0]] || current_life_cycle[0] : current_life_cycle[0];

      var instance_options = this._instance.get(current_domain);

      var _instance_options$ = instance_options[0],
          beforeFetch = _instance_options$.beforeFetch,
          afterResponse = _instance_options$.afterResponse,
          afterParesed = _instance_options$.afterParesed,
          filter = _instance_options$.filter,
          failed = _instance_options$.failed,
          prefix = _instance_options$.prefix,
          name = _instance_options$.name,
          headers = _instance_options$.headers,
          fileName = _instance_options$.fileName,
          options = _objectWithoutProperties(_instance_options$, ["beforeFetch", "afterResponse", "afterParesed", "filter", "failed", "prefix", "name", "headers", "fileName"]);

      var vuex = this._Vuex && instance_options[1] || {
        enable: false
      };
      var url = toPrefixPath(real_path, prefix);

      if (spec === "DOWNLOAD") {
        Object.assign(options, {
          method: method
        }, current_life_cycle[3]);
      } else {
        Object.assign(options, current_life_cycle[3], {
          method: method
        });
      }

      options.headers = _objectSpread({}, headers, current_life_cycle[2]);

      if (spec === "UPLOAD") {
        delete options.headers["Content-Type"];
      }

      if (method === "GET") {
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";

        if (dataOrParams) {
          var seatch_url = new URLSearchParams();
          Object.keys(dataOrParams).map(function (key) {
            seatch_url.append(key, dataOrParams[key]);
          });
          url = url + "?" + seatch_url;
        }
      } else if (dataOrParams) {
        switch (true) {
          case options.headers["Content-Type"] === undefined:
          case /multipart\/form-data/.test(options.headers["Content-Type"]):
            var fd = new FormData();
            Object.keys(dataOrParams).map(function (key) {
              return fd.append(key, dataOrParams[key]);
            });
            options.body = fd.toString();
            break;

          case /application\/json/.test(options.headers["Content-Type"]):
            options.body = JSON.stringify(dataOrParams);
            break;

          case /application\/x-www-form-urlencoded/.test(options.headers["Content-Type"]):
            var url_sp = new URLSearchParams();
            Object.keys(dataOrParams).map(function (key) {
              return url_sp.append(key, dataOrParams[key]);
            });
            options.body = url_sp.toString();
            break;

          default:
            throw Error("no support data type!");
        }
      }

      function execEvent(name, args1, args2) {
        if (current_life_cycle[4] && current_life_cycle[4][name]) {
          current_life_cycle[4][name](args1, args2);
        } else if (instance_options[0][name]) {
          instance_options[0][name](args1, args2);
        }
      }

      var api;

      if (vuex.enable) {
        api = vuex.restful ? toLower(method) + "_" + current_life_cycle[0] : current_life_cycle[0];
      }

      execEvent("beforeFetch", {
        url: url,
        options: options
      });

      if (vuex.enable) {
        this._Vuex.dispatch("VUE_FETCH_API_STATUS_UPDATE", {
          api: api,
          status: "fetching"
        });
      }

      return fetch(url, options).then(function (response) {
        var filename = null;
        var type = response.headers.get("Content-Type");
        var disposition = response.headers.get("Content-Disposition");

        if (disposition) {
          filename = disposition.match(/attachment; filename="(.+)"/i);
        }

        execEvent("afterResponse", response);

        if (vuex.enable) {
          _this3._Vuex.dispatch("VUE_FETCH_API_STATUS_UPDATE", {
            api: api,
            status: "parsing"
          });
        }

        if (!response.ok) throw {
          response: response,
          type: type
        };
        return parseStream(response, type, /DOWNLOAD|STREAM/.test(spec) && {
          immediately: spec === "DOWNLOAD",
          filename: filename || dataOrParams && dataOrParams.filename || options.headers["File-Name"] // stream actions

        }).catch(function (err) {
          throw {
            parseError: true,
            err: err
          };
        });
      }).then(function (data) {
        execEvent("afterParesed", data);

        if (vuex.enable) {
          _this3._Vuex.dispatch("VUE_FETCH_API_STATUS_UPDATE", {
            api: api,
            status: "done"
          });
        }

        return filter ? filter(data) : data;
      }).catch(function (err) {
        execEvent("failed", err);

        if (vuex.enable) {
          _this3._Vuex.dispatch("VUE_FETCH_API_STATUS_UPDATE", {
            api: api,
            status: "error"
          });
        }

        if (err.response && err.type) {
          return parseStream(err.response, err.type).then(function (info) {
            execEvent("failed", {
              status: err.response.status,
              statusText: err.response.statusText,
              url: err.response.url
            }, info);
          });
        } else if (err.parseError) {
          execEvent("failed", {
            status: err.response.status,
            statusText: "Interface parseing failed",
            url: err.response.url
          }, err.err);
        } else {
          // misspelled url like fetch('https::://hey.com') – TypeError Failed to execute 'fetch' on 'Window': Failed to parse URL from https::://hey.com;
          // nonexistent url like fetch('http://hey') – TypeError: Failed to fetch (GET http://hey/ net::ERR_NAME_NOT_RESOLVED);
          // you don't have an internet connection fetch('https://google.com') – TypeError: Failed to fetch (GET https://google.com/ net::ERR_NAME_RESOLUTION_FAILED)
          // because of the Content Security Policy fetch('https://google.com') – TypeError: Failed to fetch (Refused to connect to 'https://google.com/' because it violates the following Content Security Policy directive: "connect-src 'self'...)
          // because of the CORS fetch('https://google.com') – TypeError: Failed to fetch (Fetch API cannot load https://google.com/ has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource....)
          var statusText = err.message || "Unknow Error";

          if (err.message === "Failed to fetch") {
            statusText = "UnknowError: it can be internet connection lost or provide an unreachable domain; Most likely a CORS or Content Security Policy problem";
          }

          execEvent("failed", {
            status: 400,
            statusText: statusText
          }, err.err);
        }
      });
    }
  }, {
    key: "registerVuex",
    value: function registerVuex(apis) {
      var _this4 = this;

      Object.keys(apis).map(function (api) {
        var hasDomain = _this4._instance.get(api);

        if (hasDomain) {
          if (hasDomain[1] && hasDomain[1].enable) {
            _this4._registerVuexModule(apis[api], hasDomain[1] && hasDomain[1].restful, api);
          }
        } else {
          throw Error("domain ".concat(api, " is unregistered"));
        }
      });
    }
  }, {
    key: "config",
    value: function config(_config) {
      this._createNewLifeCycle({
        config: _config
      });

      return this;
    }
  }, {
    key: "hook",
    value: function hook(hooks) {
      this._createNewLifeCycle({
        hooks: hooks
      });

      return this;
    }
  }, {
    key: "fetch",
    value: function (_fetch) {
      function fetch(_x, _x2) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function (url, options) {
      return fetch(url, options);
    })
  }, {
    key: "from",
    value: function from(domain) {
      this._createNewLifeCycle({
        domain: domain
      });

      return this;
    }
  }, {
    key: "setHeaders",
    value: function setHeaders(headers) {
      this._createNewLifeCycle({
        headers: headers
      });

      return this;
    }
  }, {
    key: "post",
    value: function post(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "POST");
    }
  }, {
    key: "delete",
    value: function _delete(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "DELETE");
    }
  }, {
    key: "put",
    value: function put(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "PUT");
    }
  }, {
    key: "patch",
    value: function patch(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "PATCH");
    }
  }, {
    key: "get",
    value: function get(path, params) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(params, "GET");
    }
  }, {
    key: "download",
    value: function download(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "GET", "DOWNLOAD");
    }
  }, {
    key: "upload",
    value: function upload(path, data) {
      this._createNewLifeCycle({
        path: path
      });

      return this._doFetch(data, "POST", "UPLOAD");
    } // todo stream
    // stream(path, data){
    //   this._createNewLifeCycle({ path });
    //   return this._doFetch(data, "POST", "UPLOAD");
    // }

  }]);

  return Vuefetch;
}();

var _Vue = null;

function config(options) {
  return options;
}

function install(Vue) {
  if (_Vue && _Vue === Vue) {
    return;
  }

  _Vue = Vue;
  Vue.mixin({
    beforeCreate: initVuefetch
  });
}

function initVuefetch() {
  var options = this.$options;
  var vuex = options.store || options.parent && options.parent.$store;

  if (options.http) {
    this.$vf = new Vuefetch(options.http, vuex, _Vue.set);
    this.$registerApi;
  } else if (options.parent && options.parent.$vf) {
    this.$vf = options.parent.$vf;
  }
}

var index = {
  install: install,
  config: config,
  version: "0.2.1"
};

export default index;
