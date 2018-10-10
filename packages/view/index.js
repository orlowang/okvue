import view from "./view.vue";

const View = {
  install(Vue) {
    return Vue.component(view.name, view);
  }
};

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(View);
}

export default View;
