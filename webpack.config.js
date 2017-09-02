/* eslint no-var: 0 */
require("./register-babel");
var config = require("./webpack/webpack.config");
module.exports = function(env, argv) {
  return config(env, argv);
}
