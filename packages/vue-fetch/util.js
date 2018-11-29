const stringify = require("qs/lib/stringify");
let { slice } = [],
  debug = false,
  ntick;

export const nativeFetch = window.fetch;

export default function({ config, nextTick }) {
  ntick = nextTick;
  debug = config.debug || !config.silent;
}

export function nextTick(cb, ctx) {
  return ntick(cb, ctx);
}

export function trim(str) {
  return str ? str.replace(/^\s*|\s*$/g, "") : "";
}

export function trimEnd(str, chars) {
  if (str && chars === undefined) {
    return str.replace(/\s+$/, "");
  }

  if (!str || !chars) {
    return str;
  }

  return str.replace(new RegExp(`[${chars}]+$`), "");
}

export function toLower(str) {
  return str ? str.toLowerCase() : "";
}

export function toUpper(str) {
  return str ? str.toUpperCase() : "";
}

export const isArray = Array.isArray;

export function isString(val) {
  return typeof val === "string";
}

export function isBoolean(val) {
  return val === true || val === false;
}

export function isFunction(val) {
  return typeof val === "function";
}

export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

export function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

export function isBlob(obj) {
  return typeof Blob !== "undefined" && obj instanceof Blob;
}

export function isFormData(obj) {
  return typeof FormData !== "undefined" && obj instanceof FormData;
}

export function options(fn, obj, opts) {
  opts = opts || {};

  if (isFunction(opts)) {
    opts = opts.call(obj);
  }
  const vuefetch = obj.$root.$store.state["_vue_fetch"];
  if (!vuefetch) {
    const state = {};
    const getters = {};
    Object.keys(opts.api).map(api => {
      state[api] = "init";
      getters[api] = state => state[api];
    });
    obj.$root.$store.registerModule("_vue_fetch", {
      state,
      mutations: {
        VUE_FETCH_UPDATER: (state, { api, status }) => {
          if (typeof api === "string") {
            state[api] = status;
          } else {
            state[api.url] = status;
          }
        }
      },
      getters,
      actions: {
        VUE_FETCH_ACTION: ({ commit }, { path, data, config }) => {
          const _conf = { ...opts, ...config };
          const { prestart, filter, failed, backend, api, blob, ...rest } = _conf;
          commit("VUE_FETCH_UPDATER", { api: path, status: "fetching" });
          if (prestart) prestart();
          function parsePath(path) {
            if (typeof path === "string") {
              return backend + "/" + api[path];
            }
            const { url, query } = path;
            let _path = backend + "/" + api[url];
            if (query) {
              _path +=
                "?" +
                Object.keys(query)
                  .map(q => `${q}=${query[q]}`)
                  .join("&");
            }
            rest.method = "GET";
            return _path;
          }
          function fromatData(data) {
            if (rest && rest.headers && rest.headers["content-type"]) {
              if (
                rest.headers["content-type"] ===
                "application/x-www-form-urlencoded"
              ) {
                return stringify(data);
              }
            }
            return JSON.stringify(data);
          }
          return nativeFetch(parsePath(path), {
            body: fromatData(data),
            ...rest
          })
            .then(res => {
              const type = res.headers.get("Content-Type");
              if (!res.ok) throw { res, type };
              return parseStream(res, type, blob);
            })
            .then(data => {
              commit("VUE_FETCH_UPDATER", { api: path, status: "done" });
              return filter ? filter(data) : data;
            })
            .catch(err => {
              commit("VUE_FETCH_UPDATER", { api: path, status: "error" });
              if (err.res) {
                parseStream(err.res, err.type).then(info => {
                  if (failed) {
                    failed(
                      {
                        status: err.res.status,
                        statusText: err.res.statusText,
                        url: err.res.url
                      },
                      info
                    );
                  }
                });
              } else {
                // todo
                // misspelled url like fetch('https::://hey.com') – TypeError Failed to execute 'fetch' on 'Window': Failed to parse URL from https::://hey.com;
                // nonexistent url like fetch('http://hey') – TypeError: Failed to fetch (GET http://hey/ net::ERR_NAME_NOT_RESOLVED);
                // you don't have an internet connection fetch('https://google.com') – TypeError: Failed to fetch (GET https://google.com/ net::ERR_NAME_RESOLUTION_FAILED)
                // because of the Content Security Policy fetch('https://google.com') – TypeError: Failed to fetch (Refused to connect to 'https://google.com/' because it violates the following Content Security Policy directive: "connect-src 'self'...)
                // because of the CORS fetch('https://google.com') – TypeError: Failed to fetch (Fetch API cannot load https://google.com/ has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource....)
                if (failed)
                  failed({
                    statusCode: 800,
                    message: "Unknow Error",
                    detail: err.message
                  });
              }
            });
        }
      }
    });
  }

  return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

export function parseStream(src, type, blob) {
  switch (true) {
    case /multipart/.test(type):
      return src.formData();
    // !todo
    case /video|audio|image|message|x-token/.test(type):
    case /application\/json/.test(type):
      return src.json();
    case /text/.test(type):
    case blob:
      return src;
    default:
      return src.text();
  }
}

export function merge(target) {
  var args = slice.call(arguments, 1);

  args.forEach(source => {
    _merge(target, source, true);
  });

  return target;
}

export function defaults(target) {
  var args = slice.call(arguments, 1);

  args.forEach(source => {
    for (var key in source) {
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  });

  return target;
}

function _merge(target, source, deep) {
  for (var key in source) {
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
        target[key] = {};
      }
      if (isArray(source[key]) && !isArray(target[key])) {
        target[key] = [];
      }
      _merge(target[key], source[key], deep);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
}

export function fetch(src, data, config) {
  if (isArray(src)) {
    return Promise.all(
      src.map(item =>
        this.$vm.$store.dispatch("VUE_FETCH_ACTION", {
          path: item,
          config: data || {}
        })
      )
    );
  }
  return this.$vm.$store.dispatch("VUE_FETCH_ACTION", {
    path: src,
    data,
    config
  });
}
