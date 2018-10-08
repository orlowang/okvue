import Vue from "vue";
import Vuex from "vuex";
import vuefetch from "../lib";

Vue.use(vuefetch);
Vue.use(Vuex);

const page = new Vue({
  fetch: {
    backend: process.env.VUE_APP_API,
    api,
    dataType: "json", // ["json", "raw", "form", "file"]
    prestart: () => {},
    success: () => {},
    failed: err => {
      console.log(err);
    }
    // withCredentials: "include",
    // mode: "cors",
    // method: "post"
  },
  store: new Vuex.store({})
}).$mount(document.createElement("div"));
export default page;
