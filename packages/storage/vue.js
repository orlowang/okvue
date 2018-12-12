import storage from "./";

const Storage = {
  install(Vue) {
    Vue.prototype.$storage = new storage();
  }
};

if (typeof window !== "undefined" && window.Vue) {
  Vue.prototype.$storage = new storage();
}

export default Storage;
