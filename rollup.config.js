import babel from "rollup-plugin-babel";

module.exports = {
  input: "src/js/index.js",
  output: {
    file: "build/bundle.js",
    format: "cjs"
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
};
