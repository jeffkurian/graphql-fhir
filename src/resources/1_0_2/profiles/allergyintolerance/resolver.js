const errorUtils = require('../../../../utils/error.utils');
var config = require('../../../../datasources/config.json');
/**
 * @name exports.getAllergyIntolerance
 * @static
 * @summary AllergyIntolerance resolver.
 */
module.exports.getAllergyIntolerance = function getAllergyIntolerance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let logger = context.server.logger;

	return new Promise(async (resolve, reject) => {
		try {
			reqOpts = { uri: '/AllergyIntolerance' };
			var { entry } = await context.server.orionDataSource.invokeOrionFhirAPI(
				req,
				reqOpts,
				args,
			);

			var allergyIntolerance = {};
			if (entry) {
				allergyIntolerance = entry[0].resource;
			}
			resolve(allergyIntolerance);
		} catch (err) {
			logger.error(err);
			let error = errorUtils.internal(version, err.message);
			reject(errorUtils.formatErrorForGraphQL(error));
		}
	});
};

/**
 * @name exports.getAllergyIntoleranceList
 * @static
 * @summary AllergyIntolerance list resolver.
 */
module.exports.getAllergyIntoleranceList = function getAllergyIntoleranceList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let logger = context.server.logger;

	return new Promise((resolve, reject) => {
		(async () => {
			try {
				reqOpts = { uri: '/AllergyIntolerance' };
				var data = await context.server.orionDataSource.invokeOrionFhirAPI(
					req,
					reqOpts,
					args,
				);
				resolve(data);
			} catch (err) {
				logger.error(err);
				let error = errorUtils.internal(version, err);
				reject(errorUtils.formatErrorForGraphQL(error));
			}
		})();
	});
};

/**
 * @name exports.getAllergyIntoleranceInstance
 * @static
 * @summary AllergyIntolerance instance resolver.
 */
module.exports.getAllergyIntoleranceInstance = function getAllergyIntoleranceInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createAllergyIntolerance
 * @static
 * @summary Create AllergyIntolerance resolver.
 */
module.exports.createAllergyIntolerance = function createAllergyIntolerance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.updateAllergyIntolerance
 * @static
 * @summary Update AllergyIntolerance resolver.
 */
module.exports.updateAllergyIntolerance = function updateAllergyIntolerance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.removeAllergyIntolerance
 * @static
 * @summary Remove AllergyIntolerance resolver.
 */
module.exports.removeAllergyIntolerance = function removeAllergyIntolerance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
