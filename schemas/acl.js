"use strict";

const apiGroup = require("./aclApiGroup");
const granularAcl = require("./aclGranular");

const acl = {
	'source': ['body.acl'],
	'validation': {
		"type": "object",
		"patternProperties": {
			"^[a-zA-Z0-9]+$": {
				"type": "object",
				"patternProperties": {
					"^[^\W\.]+$": {
						"oneOf": [
							apiGroup,
							granularAcl
						]
					}
				},
				"additionalProperties": false
			}
		},
		"additionalProperties": false
	}
};

module.exports = acl;


