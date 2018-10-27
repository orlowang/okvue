import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import VuePlugin from "rollup-plugin-vue";
import cleaner from "rollup-plugin-cleaner";
import pkg from "./package.json";

const banner = `/*
 \* library: ${pkg.name}
 \* version: ${pkg.version}
 \* author: ${pkg.author || "Orlo Wang <ow.cc#outlook.com>"}
 */`;
export default {
  input: "index.js",
  output: [
    {
      banner,
      format: "cjs",
      name: "view",
      file: "lib/index.common.js"
    },
    {
      banner,
      format: "esm",
      name: "view",
      file: "lib/index.esm.js"
    }
  ],
  plugins: [
    cleaner({
      targets: ["./lib/"]
    }),
    VuePlugin(),
    resolve({
      browser: true
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
