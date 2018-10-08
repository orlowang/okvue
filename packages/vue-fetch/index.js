import Util, { options } from "./util";
import fetchFuc from "./fetch";

function vuefetch(Vue) {
  if (vuefetch.installed) {
    return;
  }

  Util(Vue);
  Vue.fetch = fetchFuc;
  Object.defineProperty(Vue.prototype, "$fetch", {
    get() {
      return options(Vue.fetch, this, this.$root.$options.fetch);
    }
  });
}

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(vuefetch);
}

export default vuefetch;
