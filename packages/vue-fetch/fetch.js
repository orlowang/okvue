import { isArray } from "./util";

export const nativeFetch = window.fetch;
export default function fetch(src, data, config) {
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
