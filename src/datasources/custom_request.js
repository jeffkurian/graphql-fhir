var req = require("request");
var HttpsProxyAgent = require("https-proxy-agent");

/**
 * Make a request using node.
 *
 * @param   {string}  method
 * @param   {string}  url
 * @param   {string}  body
 * @param   {Object}  headers
 * @returns {Promise}
 */
module.exports = function request(method, url, body, headers) {
  var proxy = process.env.https_proxy;

  if (proxy) {
    this.agent = new HttpsProxyAgent(proxy);
  }

  return new Promise(function(resolve, reject) {
    req(
      {
        url: url,
        body: body,
        method: method,
        headers: headers,
        agent: this.agent
      },
      function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          resolve({
            status: response.status,
            body: body
          });
        }
      }
    );
  });
};
