var ClientOAuth2 = require('client-oauth2');
var request = require('request');
var config = require('./config.json');
var custom_req = require('./custom_request');
const logger = require('../lib/winston')({ level: 'debug' });

var Tools = function() {
	var tools = this;

	var HttpsProxyAgent = require('https-proxy-agent');
	var proxy = process.env.https_proxy;

	if (proxy) {
		this.agent = new HttpsProxyAgent(proxy);
	}

	var authConfig = {
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		accessTokenUri: config.tokenUri,
		redirectUri: config.redirectUri,
		agent: this.agent,
	};

	this.basicAuth = require('btoa')(
		authConfig.clientId + ':' + authConfig.clientSecret,
	);

	// Should be used to check for 401 response when making an API call.  If a 401
	// response is received, refresh tokens should be used to get a new access token,
	// and the API call should be tried again.
	this.checkForUnauthorized = function(req, requestObj, err, response) {
		return new Promise(async function(resolve, reject) {
			if (response.statusCode == 401) {
				logger.info('Received a 401 response!  Trying to refresh tokens.');

				try {
					// Refresh the tokens
					var newToken = await tools.refreshTokens(req.session);

					requestObj.headers.Authorization = 'Bearer ' + newToken.accessToken;
					logger.info('Trying again, making API call to: ' + requestObj.url);
					request(requestObj, function(err, response) {
						// Logic (including error checking) should be continued with new
						// err/response objects.
						resolve({ err, response });
					});
				} catch (err) {
					// No 401, continue!
					logger.error(err);
					resolve({ err, response });
				}
			} else {
				// No 401, continue!
				resolve({ err, response });
			}
		});
	};

	// Refresh Token should be called if access token expires, or if Intuit
	// returns a 401 Unauthorized.
	this.refreshTokens = function(session) {
		var token = this.getToken(session);

		// Call refresh API
		return token.refresh().then(function(newToken) {
			// Store the new tokens
			tools.saveToken(session, newToken);
			return newToken;
		});
	};

	//A static function to refresh Token with refresh token. Return the token created.
	this.refreshTokensWithToken = function(token) {
		if (!token) {
			return Promise.reject(
				new Error('Nil Token passed for refreshTokensWithToken'),
			);
		}

		request(
			{
				url: config.tokenHost,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: 'Basic ' + tools.basicAuth,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				agent: this.agent,
				form: {
					refresh_token: token,
					grant_type: 'refresh_token',
				},
			},
			function(err, response) {
				if (err) {
					logger.error(err);
					return err;
				}

				var json = JSON.parse(response.body);
				return tools.oauth2Client.createToken(
					json.access_token,
					json.refresh_token,
					json.token_type,
					json.x_refresh_token_expires_in,
				);
			},
		);
	};

	// Setup OAuth2 Client with values from config.json
	this.oauth2Client = new ClientOAuth2(authConfig, custom_req);

	this.clearToken = function(session) {
		session.accessToken = null;
		session.refreshToken = null;
		session.tokenType = null;
		session.data = null;
	};

	// Save token into session storage
	// In a real use-case, this is where tokens would have to be persisted (to a
	// a SQL DB, for example).  Both access tokens and refresh tokens need to be
	// persisted.  This should typically be stored against a user / realm ID, as well.
	this.saveToken = function(session, token) {
		session.accessToken = token.accessToken;
		session.refreshToken = token.refreshToken;
		session.tokenType = token.tokenType;
		session.data = token.data;
	};

	// Get the token object from session storage
	this.getToken = function(session) {
		if (!session.accessToken) return null;

		return tools.oauth2Client.createToken(
			session.accessToken,
			session.refreshToken,
			session.tokenType,
			session.data,
		);
	};

	this.getOwnerToken = function(session, username, password) {
		return new Promise(async function(resolve, reject) {
			if (!session.accessToken) {
				username = username ? username : config.defaultusername;
				password = password ? password : config.defaultpassword;

				try {
					var token = await tools.oauth2Client.owner.getToken(
						username,
						password,
					);
					tools.saveToken(session, token);

					resolve(token);
				} catch (err) {
					logger.error('Error ', err);
					reject(err);
				}
			} else {
				resolve(
					tools.oauth2Client.createToken(
						session.accessToken,
						session.refreshToken,
						session.tokenType,
						session.data,
					),
				);
			}
		});
	};
};

module.exports = new Tools();
