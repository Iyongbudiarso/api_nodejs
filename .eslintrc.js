module.exports = {
  "extends": "airbnb-base",
  "rules": {
      // // override default options
      // "indent": ["error", 2],
      // "no-cond-assign": ["error", "always"],

      // disable now, but enable in the future
      "one-var": "off", // ["error", "never"]
      "func-names": "off",
      "consistent-return": "off",
      "no-unused-vars": ["error", { "args": "after-used" }],
      "max-len": ["error", { "code": 250, "ignoreComments": true }],
      "no-unused-expressions": ["error", { "allowShortCircuit": true }],

      // // disable
      // "init-declarations": "off",
      // "no-console": "off",
      // "no-inline-comments": "off",
  }
}