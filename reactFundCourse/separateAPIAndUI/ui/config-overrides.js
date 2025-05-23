// config-overrides.js
const { override, useBabelRc: babelRc } = require('customize-cra')

module.exports = override(babelRc())
