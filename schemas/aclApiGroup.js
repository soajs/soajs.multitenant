"use strict";

const apiGroup = {"type": "array", "items": {"type": "string"}};

const aclApi = {
	"type": "array",
	"minItems": 1,
	"items": {
		"type": "object",
		"properties": {
			"access": {"type": "boolean"},
			"version": {"type": "string"},
			"apisPermission": {
				"type": "string", "enum": ["restricted"]
			},
			"get": apiGroup,
			"post": apiGroup,
			"put": apiGroup,
			"delete": apiGroup,
			"head": apiGroup,
			"patch": apiGroup,
			"options": apiGroup,
			"other": apiGroup
		},
		"additionalProperties": false,
		"required": ["get", "post", "put", "delete", "head", "patch", "options", "other"]
	}
};

module.exports = aclApi;