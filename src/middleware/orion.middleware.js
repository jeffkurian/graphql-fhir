/**
 * @name exports
 * @summary Orion Middleware function
 */
module.exports = function orionMiddleware(server) {
	return async (req, res, next) => {
		var token = await server.orionDataSource.initOrionToken(req.session);
		return next();
	};
};
