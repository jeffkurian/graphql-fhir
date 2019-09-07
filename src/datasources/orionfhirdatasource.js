var request = require('request');
var tools = require('./tools');
var config = require('./config.json');
const logger = require('../lib/winston')({ level: 'debug' });
const qs = require('qs');

request.debug = true;

var OrionFHIRDataSource = function() {
	var orionFHIRDataSource = this;

	var requestObj = {
		url: config.baseUrl,
		baseUrl: config.baseUrl,
		headers: {
			Accept: 'application/json',
		},
	};

	this.invokeOrionFhirAPI = function(req, reqOpts, fhirQuery) {
		return new Promise(async function(resolve, reject) {
			try {
				var token = tools.getToken(req.session);

				if (!token) {
					token = await tools.getOwnerToken(req.session);
				}

				requestObj.headers.Authorization = 'Bearer ' + token.accessToken;

				var options = Object.assign({}, requestObj, reqOpts);
				if (fhirQuery) {
					// options.qs = qs.stringify(fhirQuery, { allowDots: true });
					options.qs = fhirQuery;
					options.qsStringifyOptions = { allowDots: true };
				}

				request(options, async function(err, response) {
					// Check if 401 response was returned - refresh tokens if so!
					try {
						var data = await tools.checkForUnauthorized(
							req,
							options,
							err,
							response,
						);
						if (data.response.statusCode != 200) {
							reject(data.response.body);
							return;
						}

						var resData = JSON.parse(data.response.body);
						// API Call was a success!
						resolve(resData);
						return;
					} catch (err) {
						reject(err);
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	};
};

module.exports = new OrionFHIRDataSource();
