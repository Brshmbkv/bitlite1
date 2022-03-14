module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "rules": {
    "indent": [
      "warn",
      2
    ],
    "object-curly-spacing": [
      "warn",
      "always"
    ],
    "vue/order-in-components": [
      "warn"
    ]
    // "vue/valid-v-slot": ["error", {
    //   allowModifiers: true,
    // }]
  }
}