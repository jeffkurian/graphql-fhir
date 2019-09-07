const errorUtils = require('../../../../utils/error.utils');
var config = require('../../../../datasources/config.json');

/**
 * @name exports.getPatient
 * @static
 * @summary Patient resolver.
 */
module.exports.getPatient = function getPatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let logger = context.server.logger;

	return new Promise(async (resolve, reject) => {
		try {
			reqOpts = { uri: '/Patient' };
			var { entry } = await context.server.orionDataSource.invokeOrionFhirAPI(
				req,
				reqOpts,
				args,
			);

			var patient = {};
			if (entry) {
				patient = entry[0].resource;
			}
			resolve(patient);
		} catch (err) {
			logger.error(err);
			let error = errorUtils.internal(version, err.message);
			reject(errorUtils.formatErrorForGraphQL(error));
		}
	});
};

/**
 * @name exports.getPatientList
 * @static
 * @summary Patient list resolver.
 */
module.exports.getPatientList = function getPatientList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let logger = context.server.logger;

	return new Promise(async (resolve, reject) => {
		try {
			reqOpts = { uri: '/Patient' };
			var data = await context.server.orionDataSource.invokeOrionFhirAPI(
				req,
				reqOpts,
				args,
			);
			resolve(data);
		} catch (err) {
			logger.error(err);
			let error = errorUtils.internal(version, err.message);
			reject(errorUtils.formatErrorForGraphQL(error));
		}
	});
};

/**
 * @name exports.getPatientInstance
 * @static
 * @summary Patient instance resolver.
 */
module.exports.getPatientInstance = function getPatientInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createPatient
 * @static
 * @summary Create Patient resolver.
 */
module.exports.createPatient = function createPatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.updatePatient
 * @static
 * @summary Update Patient resolver.
 */
module.exports.updatePatient = function updatePatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.removePatient
 * @static
 * @summary Remove Patient resolver.
 */
module.exports.removePatient = function removePatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
