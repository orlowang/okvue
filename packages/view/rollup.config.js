import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import VuePlugin from "rollup-plugin-vue";

export default {
  input: "index.js",
  output: [
    {
      format: "cjs",
      name: "view",
      file: "lib/index.common.js"
    },
    {
      format: "esm",
      name: "view",
      file: "lib/index.esm.js"
    }
  ],
  plugins: [
    VuePlugin(),
    resolve({
      browser: true
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
