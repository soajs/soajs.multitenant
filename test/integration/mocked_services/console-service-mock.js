"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This service takes care of updates and upgrades as well as everything related to registry",
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": "1",
	"serviceName": "console",
	"serviceGroup": "Console",
	"servicePort": 4009,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	"urac": true,
	
	"maintenance": {
		"readiness": "/heartbeat",
		"port": {"type": "maintenance"},
		"commands": [
			{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
			{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
		]
	},
	//-------------------------------------
	"errors": {
		400: "Business logic required data are missing",
	},
	"schema": {
		"commonFields": {
			"env": {
				"source": ["body.env", "query.env"],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
		},
		
		"get": {
			"/registry/key": {
				"_apiInfo": {
					"l": "This API get the registry key",
					"group": "Registry"
				},
				"commonFields": ["env"]
			}
		}
	}
};
config.packagejson = {};
const service = new soajs.server.service(config);

function run(serviceStartCb) {
	service.init(() => {
		service.get("/registry/key", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				algorithm: "aes256",
				password: "soajs key lal massa"
			}));
			
		});
		service.start(serviceStartCb);
	});
}

function stop(serviceStopCb) {
	service.stop(serviceStopCb);
}

module.exports = {
	"runService": (serviceStartCb) => {
		if (serviceStartCb && typeof serviceStartCb === "function") {
			run(serviceStartCb);
		} else {
			run(null);
		}
	},
	"stopService": (serviceStopCb) => {
		if (serviceStopCb && typeof serviceStopCb === "function") {
			stop(serviceStopCb);
		} else {
			stop(null);
		}
	}
};
