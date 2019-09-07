const { GraphQLString } = require('graphql');
const TokenScalar = require('../scalars/token.scalar.js');

/**
 * @name exports
 * @static
 * @summary Arguments for the resource query
 */
module.exports = {
	// http://hl7.org/fhir/SearchParameter/Resource-identifier
	identifier: {
		type: TokenScalar,
		fhirtype: 'token',
		xpath: 'identifier',
		description: 'Unique identifier',
	},
};
