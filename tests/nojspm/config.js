System.config({
  baseURL: "/grunt-systemjs-builder/tests/nojspm/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },

  paths: {
    "npm:*": "libs/*"
  },

  map: {
    "babel": "libs/babel-core/browser"
  }
});
