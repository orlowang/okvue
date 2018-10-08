import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "index.js",
  output: [
    {
      format: "cjs",
      name: "vuefetch",
      file: "lib/index.common.js"
    },
    {
      format: "esm",
      name: "vuefetch",
      file: "lib/index.esm.js"
    }
  ],
  plugins: [
    resolve({
      browser: true
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
