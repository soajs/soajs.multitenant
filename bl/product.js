/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const core = require('soajs').core;
const request = require('request');
const async = require('async');
const validator = new core.validator.Validator();

const apiGroup = require("../schemas/aclApiGroup");
const granularAcl = require("../schemas/aclGranular");

function computeErrorMessageFromService(body) {
	if (body && !body.result) {
		let error = "";
		if (body.errors && body.errors && body.errors.details && body.errors.details.length > 0) {
			body.errors.details.forEach((detail) => {
				if (error === "") {
					error += " " + detail.message;
				} else {
					error += " - " + detail.message;
				}
			});
		}
		return new Error(error);
	} else {
		return new Error(" Service not found");
	}
}

function groupApisForDisplay(apisArray, apiGroupName, cb) {
	let result = {};
	let defaultGroupName = 'General';
	async.each(apisArray, function (one, callback) {
		if (one[apiGroupName]) {
			defaultGroupName = one[apiGroupName];
		}
		
		if (!result[defaultGroupName]) {
			result[defaultGroupName] = {};
			result[defaultGroupName].apis = [];
			if (one.m) {
				result[defaultGroupName].apisRest = {};
			}
		}
		if (one.m) {
			if (!result[defaultGroupName].apisRest[one.m]) {
				result[defaultGroupName].apisRest[one.m] = [];
			}
			result[defaultGroupName].apisRest[one.m].push(one);
		}
		result[defaultGroupName].apis.push(one);
		
		return callback();
	}, function () {
		return cb(result);
	});
}

function fillServiceAccess(service, currentService, cb) {
	if (currentService.versions) {
		service.collapse = false;
		service.include = true;
		async.eachSeries(currentService.versions, function (v, callback) {
			if (!service[v.version]) {
				service[v.version] = {
					include: false
				};
			} else {
				service[v.version].include = true;
				if (service[v.version].access) {
					if (service[v.version].access === true) {
						service[v.version].accessType = 'private';
					} else if (service[v.version].access === false) {
						service[v.version].accessType = 'public';
					} else if (Array.isArray(service[v.version].access)) {
						service[v.version].accessType = 'groups';
						service[v.version].grpCodes = {};
						service[v.version].access.forEach(function (c) {
							service[v.version].grpCodes[c] = true;
						});
					}
				} else {
					service[v.version].accessType = 'public';
				}
				if (service[v.version].apisPermission === 'restricted') {
					service[v.version].apisRestrictPermission = true;
				}
			}
			return callback();
		}, cb);
	} else {
		return cb();
	}
}

function fillApiAccess(method, cb) {
	async.forEachOfSeries(method, function (value, group, callback) {
		if (!value.apis) {
			return callback();
		}
		async.forEachOfSeries(value.apis, function (api, apiName, call) {
			api.include = true;
			api.accessType = 'clear';
			if (api.access === true) {
				api.accessType = 'private';
			} else if (api.access === false) {
				api.accessType = 'public';
			} else {
				if (Array.isArray(api.access)) {
					api.accessType = 'groups';
					api.grpCodes = {};
					api.access.forEach(function (c) {
						api.grpCodes[c] = true;
					});
				}
			}
			return call();
		}, callback);
	}, cb);
}

function fillServiceApiAccess(service, currentService, cb) {
	if (currentService.versions) {
		async.eachSeries(currentService.versions, function (v, callback) {
			if (service[v.version].get || service[v.version].post || service[v.version].put || service[v.version].delete || service[v.version].patch || service[v.version].options || service[v.version].other) {
				async.forEachOfSeries(service[v.version], function (value, method, call) {
					if (value && ['access', 'apiPermission'].indexOf(method) === -1 && Object.keys(value).length > 0) {
						fillApiAccess(service[v.version][method], call);
					} else {
						return call();
					}
				}, callback);
			} else {
				return callback();
			}
		}, cb);
	}
	else {
		return cb();
	}
}

function reFormACL(acl, cb) {
	let newForm = {};
	
	let addApis = (value, service, version, method) => {
		value.forEach((oneMethod) => {
			if (oneMethod.group && oneMethod.apis) {
				if (!newForm[service][version][method][oneMethod.group]) {
					newForm[service][version][method][oneMethod.group] = {
						apis: {}
					};
				}
				newForm[service][version][method][oneMethod.group].apis = oneMethod.apis;
			}
		});
	};
	if (acl && Object.keys(acl).length > 0) {
		async.forEachOfSeries(acl, function (oneAcl, service, callback) {
			newForm[service] = {};
			for (let version in oneAcl) {
				if (oneAcl.hasOwnProperty(version) && oneAcl[version]) {
					newForm[service][version] = {};
					if (oneAcl[version].hasOwnProperty('apisPermission')) {
						newForm[service][version].apisPermission = oneAcl[version].apisPermission;
					}
					if (oneAcl[version].hasOwnProperty('access')) {
						newForm[service][version].access = oneAcl[version].access;
					}
					for (let method in oneAcl[version]) {
						if (oneAcl[version].hasOwnProperty(method) && oneAcl[version][method] && ['access', 'apisPermission'].indexOf(method) === -1 && oneAcl[version][method].length > 0) {
							if (!newForm[service][version][method]) {
								newForm[service][version][method] = {};
							}
							addApis(oneAcl[version][method], service, version, method);
						}
					}
				}
			}
			return callback();
		}, function () {
			return cb(newForm);
		});
	} else {
		return cb(newForm);
	}
	
	
}

let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	
	"handleError": (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && errCode === 602) ? err.message : "")
		});
	},
	
	"mp": {
		"getModel": (soajs) => {
			let modelObj = bl.modelObj;
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				let options = {
					"dbConfig": soajs.tenant.dbConfig,
					"index": soajs.tenant.id
				};
				modelObj = new bl.model(bl.soajs_service, options, null);
			}
			return modelObj;
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	},
	
	/**
	 * Product
	 */
	"list": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		modelObj.listProducts(null, (err, records) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, records);
		});
	},
	
	"listConsole": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		modelObj.listConsoleProducts(null, (err, records) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, records);
		});
	},
	
	"get": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		data.code = inputmaskData.code;
		
		modelObj.getProduct(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 460, err), null);
			}
			return cb(null, record);
		});
	},
	
	"purge": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null), null);
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			record.scope = {
				acl: {}
			};
			for (let i = 0; i < record.packages.length; i++) {
				record.packages[i].acl = {};
			}
			
			modelObj.saveProduct(record, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err), null);
				}
				return cb(null, true);
			});
		});
	},
	
	"add": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			name: inputmaskData.name,
			code: inputmaskData.code,
			description: inputmaskData.description,
			scope: {
				acl: {}
			},
			packages: []
		};
		
		if (inputmaskData.scope) {
			data.scope = inputmaskData.scope;
		}
		modelObj.checkIfExist(data, (err, count) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			
			if (count > 0) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 468, null));
			}
			
			modelObj.addProduct(data, (err, record) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, record);
			});
		});
	},
	
	"update": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data.name = inputmaskData.name;
			if (inputmaskData.scope) {
				data.scope = inputmaskData.scope;
			}
			if (inputmaskData.description) {
				data.description = inputmaskData.description;
			}
			data._id = record._id;
			modelObj.updateProduct(data, (err, result) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 470, err));
				}
				return cb(null, result);
			});
		});
	},
	
	"updateScope": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data.scope = inputmaskData.scope;
			data._id = record._id;
			modelObj.updateProduct(data, (err, result) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 470, err));
				}
				return cb(null, result);
			});
		});
	},
	
	"updateScopeByEnv": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data.acl = inputmaskData.acl;
			data.env = inputmaskData.env;
			data._id = record._id;
			modelObj.updateScope(data, (err, result) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 470, err));
				}
				return cb(null, result);
			});
		});
	},
	
	"delete": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.code = inputmaskData.code;
		data.id = inputmaskData.id;
		
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (soajs.tenant.application.product === record.code) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 466, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data._id = record._id;
			modelObj.deleteProduct(data, (err, result) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, result);
			});
		});
	},
	
	/**
	 * Packages
	 */
	
	"getPackages": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		modelObj.getProduct(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record || !record.packages) {
				return cb(bl.handleError(soajs, 461, null), null);
			}
			return cb(null, record.packages);
		});
	},
	
	"getPackage": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.code = inputmaskData.productCode;
		
		modelObj.getProduct(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record || !record.packages) {
				return cb(bl.handleError(soajs, 461, null), null);
			}
			let pck = null;
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code === inputmaskData.packageCode) {
					pck = record.packages[i];
					break;
				}
			}
			return cb(null, (pck || {}));
		});
	},
	
	"addPackage": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null), null);
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!record.packages) {
				record.packages = [];
			}
			let prefix = record.code.toUpperCase() + '_';
			let found = false;
			if (inputmaskData.code) {
				record.packages.forEach(pack => {
					if (pack.code === prefix + inputmaskData.code.toUpperCase()) {
						found = true;
					}
				});
			}
			if (found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 467, null));
			}
			let newPackage = {
				"code": prefix + inputmaskData.code.toUpperCase(),
				"name": inputmaskData.name,
				"_TTL": inputmaskData._TTL * 3600 * 1000
			};
			
			if (inputmaskData.description) {
				newPackage.description = inputmaskData.description;
			}
			if (inputmaskData.tags) {
				newPackage.tags = inputmaskData.tags;
			}
			newPackage.acl = inputmaskData.acl ? inputmaskData.acl : {};
			if (inputmaskData.type) {
				newPackage.aclType = inputmaskData.type;
			}
			if (newPackage.acl) {
				let schema = {
					"type": "object",
					"required": false,
					"patternProperties": {
						"^[a-zA-Z0-9]+$": {
							"type": "object",
							"patternProperties": {
								"^[^\W\.]+$": newPackage.aclType === "granular" ? granularAcl : apiGroup
							},
							"additionalProperties": false
						}
					},
					"additionalProperties": false
				};
				let check = validator.validate(newPackage.acl, schema);
				if (!check.valid) {
					let message = `Invalid Acl of type ${newPackage.aclType === "granular" ? "Granular" : "Api Group"} provided!`;
					soajs.log.debug(check.errors);
					return cb({"code": "469", "msg": message});
				}
			}
			record.packages.push(newPackage);
			data._id = record._id;
			data.packages = record.packages;
			modelObj.updateProduct(record, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err), null);
				}
				return cb(null, newPackage.code);
			});
		});
	},
	
	"updatePackage": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!record.packages) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			let found = false;
			let prefix = record.code.toUpperCase() + '_';
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code.toUpperCase() === prefix + inputmaskData.code) {
					if (inputmaskData.name) {
						record.packages[i].name = inputmaskData.name;
					}
					if (inputmaskData.description) {
						record.packages[i].description = inputmaskData.description;
					}
					if (inputmaskData._TTL) {
						record.packages[i]._TTL = inputmaskData._TTL * 3600 * 1000;
					}
					if (inputmaskData.type) {
						record.packages[i].aclTypeByEnv = inputmaskData.type;
					}
					if (inputmaskData.acl) {
						record.packages[i].acl = inputmaskData.acl;
						let schema = {
							"type": "object",
							"required": false,
							"patternProperties": {
								"^[a-zA-Z0-9]+$": {
									"type": "object",
									"patternProperties": {
										"^[^\W\.]+$": record.packages[i].aclType === "granular" ? granularAcl : apiGroup
									},
									"additionalProperties": false
								}
							},
							"additionalProperties": false
						};
						let check = validator.validate(record.packages[i].acl, schema);
						if (!check.valid) {
							let message = `Invalid Acl of type ${record.packages[i].aclType === "granular" ? "Granular" : "Api Group"} provided!`;
							soajs.log.debug(check.errors);
							return cb({"code": "469", "msg": message});
						}
					}
					if (inputmaskData.tags) {
						record.packages[i].tags = inputmaskData.tags;
					}
					found = true;
					break;
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			data._id = record._id;
			data.packages = record.packages;
			modelObj.updateProduct(data, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, `product package ${inputmaskData.code} updated successfully`);
			});
		});
	},
	
	"updatePackageAclByEnv": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!record.packages) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			let found = false;
			let prefix = record.code.toUpperCase() + '_';
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code.toUpperCase() === prefix + inputmaskData.code) {
					record.packages[i].acl[inputmaskData.env.toLowerCase()] = inputmaskData.acl;
					if (inputmaskData.type) {
						if (!record.packages[i].aclTypeByEnv) {
							record.packages[i].aclTypeByEnv = {};
						}
						
						record.packages[i].aclTypeByEnv[inputmaskData.env.toLowerCase()] = inputmaskData.type;
					}
					let schema = {
						"type": "object",
						"required": false,
						"patternProperties": {
							"^[^\W\.]+$": record.packages[i].aclTypeByEnv === "granular" ? granularAcl : apiGroup
						},
						"additionalProperties": false
					};
					let check = validator.validate(inputmaskData.acl, schema);
					if (!check.valid) {
						let message = `Invalid Acl of type ${record.packages[i].aclTypeByEnv === "granular" ? "Granular" : "Api Group"} provided!`;
						soajs.log.debug(check.errors);
						return cb({"code": "469", "msg": message});
					}
					found = true;
					break;
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			data._id = record._id;
			data.packages = record.packages;
			modelObj.updateProduct(data, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, `product package ${inputmaskData.code} updated successfully`);
			});
		});
	},
	
	"deletePackage": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		modelObj.getProduct(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 460, null), null);
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!record.packages) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			let found = false;
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code.toUpperCase() === inputmaskData.packageCode) {
					record.packages.splice(i, 1);
					found = true;
					break;
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null), null);
			}
			data._id = record._id;
			data.packages = record.packages;
			modelObj.updateProduct(data, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err), null);
				}
				return cb(null, `product package ${inputmaskData.packageCode} deleted successfully`);
			});
		});
	},
	
	"getUIProductAcl": (soajs, inputmaskData, cb) => {
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		data.soajs = !!inputmaskData.soajs;
		let aclResponse = {
			serviceGroup: [],
			allServiceApis: {},
			paginations: {}
		};
		modelObj.getProduct(data, (err, product) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!product) {
				return cb(bl.handleError(soajs, 460, err), null);
			}
			soajs.awareness.connect("marketplace", "1", (response) => {
				
				let options = {
					uri: 'http://' + response.host,
					headers: response.headers,
					qs: {"type": 'service'},
					json: true
				};
				
				if (inputmaskData.soajs) {
					options.uri += "/soajs/items";
				} else {
					options.uri += "/items/type/all";
				}
				
				request.get(options, function (error, response, body) {
					if (error || !body.result) {
						return cb(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					async.eachSeries(body.data.records, function (item, callback) {
						let acl = [];
						if (item && item.configuration && item.configuration.group) {
							if (!aclResponse.allServiceApis[item.configuration.group]) {
								aclResponse.allServiceApis[item.configuration.group] = [];
							}
							if (!aclResponse.paginations[item.configuration.group]) {
								aclResponse.paginations[item.configuration.group] = {
									currentPage: 1,
									totalItems: 1
								};
							} else {
								aclResponse.paginations[item.configuration.group].totalItems++;
							}
							if (item.versions) {
								async.eachSeries(item.versions, function (value, call) {
									if (value) {
										if (aclResponse.serviceGroup.indexOf(item.configuration.group) === -1) {
											aclResponse.serviceGroup.push(item.configuration.group);
										}
										groupApisForDisplay(value.apis, 'group', (result) => {
											let aclVersion = result;
											aclVersion["%v%"] = value.version;
											aclVersion["%showApi%"] = false;
											acl.push(aclVersion);
											return call();
										});
									} else {
										return call();
									}
								}, function () {
									let newItem = {
										"type": item.type,
										"name": item.name,
										"group": item.configuration.group,
										"versions": item.versions
									};
									newItem.fixList = acl;
									aclResponse.allServiceApis[item.configuration.group].push(newItem);
									return callback();
								});
							} else {
								return callback();
							}
						} else {
							return callback();
						}
					}, function () {
						if (!product.scope || !product.scope.acl) {
							return cb(null, aclResponse);
						}
						let myAcl = {};
						async.forEachOfSeries(product.scope.acl, function (acl, env, aclCall) {
							reFormACL(acl, (result) => {
								myAcl[env.toUpperCase()] = result;
								async.forEachOfSeries(myAcl[env.toUpperCase()], function (service, serviceName, serviceCall) {
									let currentService = {};
									//need to optimize this search with async
									for (let group in aclResponse.allServiceApis) {
										if (group && aclResponse.allServiceApis[group]) {
											for (let x = 0; x < aclResponse.allServiceApis[group].length; x++) {
												if (aclResponse.allServiceApis[group][x].name === serviceName) {
													currentService = aclResponse.allServiceApis[group][x];
													break;
												}
											}
										}
									}
									async.series([
										function (callback) {
											fillServiceAccess(service, currentService, callback);
										},
										function (callback) {
											fillServiceApiAccess(service, currentService, callback);
										}
									], serviceCall);
								}, function () {
									aclResponse.aclFill = myAcl;
									return aclCall();
								});
							});
						}, function () {
							return cb(null, aclResponse);
						});
					});
				});
			});
		});
	},
	
	"getUIProductPackageAcl": (soajs, inputmaskData, cb) => {
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		data.soajs = !!inputmaskData.soajs;
		let aclResponse = {
			aclFill: {},
			scopeFill: {},
			paginations: {},
			serviceGroup: [],
			allServiceApis: {},
			allServiceApisGranular: {}
		};
		modelObj.getProduct(data, (err, product) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!product) {
				return cb(bl.handleError(soajs, 460, err), null);
			}
			
			if (!product.packages) {
				return cb(bl.handleError(soajs, 461, null), null);
			}
			let currentPackage = null;
			for (let i = 0; i < product.packages.length; i++) {
				if (product.packages[i].code === inputmaskData.package) {
					currentPackage = product.packages[i];
					break;
				}
			}
			if (!currentPackage) {
				return cb(bl.handleError(soajs, 461, null), null);
			}
			aclResponse.aclTypeByEnv = currentPackage.aclTypeByEnv;
			aclResponse.scopeFill = product.scope && product.scope.acl ? product.scope.acl : {};
			soajs.awareness.connect("marketplace", "1", (response) => {
				
				let options = {
					uri: 'http://' + response.host,
					headers: response.headers,
					qs: {"type": 'service'},
					json: true
				};
				
				if (inputmaskData.soajs) {
					options.uri += "/soajs/items";
				} else {
					options.uri += "/items/type/all";
				}
				
				request.get(options, function (error, response, body) {
					if (error || !body.result) {
						return cb(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					aclResponse.allServiceApis = body.data.records;
					if (!currentPackage.acl) {
						currentPackage.acl = {};
					}
					async.eachSeries(inputmaskData.config.envs, function (env, call) {
						aclResponse.aclFill[env.toUpperCase()] = currentPackage.acl[env.toLowerCase()] ? currentPackage.acl[env.toLowerCase()] : {};
						if (inputmaskData.config.type) {
							if (inputmaskData.config.type === "granular") {
								applyGranular(body, env.toLowerCase(), call);
							} else {
								applyApiGroup(env.toLowerCase(), call);
							}
						} else {
							if (currentPackage.aclTypeByEnv && currentPackage.aclTypeByEnv[env.toLowerCase()] === "granular") {
								applyGranular(body, env.toLowerCase(), call);
							} else {
								applyApiGroup(env.toLowerCase(), call);
							}
						}
					}, () => {
						return cb(null, aclResponse);
					});
				});
			});
			
			function applyApiGroup(envS, cb) {
				let aclFill = JSON.parse(JSON.stringify(aclResponse.aclFill));
				let addMethod = (value, fixAcl, env, service, version, method) => {
					value.forEach((group) => {
						if (!fixAcl[env][service][version][group]) {
							fixAcl[env][service][version][group] = {};
						}
						fixAcl[env][service][version][group][method] = true;
					});
				};
				
				let addOptions = (value, fixAcl, env, service) => {
					value.forEach((v) => {
						if (v.version) {
							fixAcl[env][service][v.version] = {
								"include": true,
								"collapse": false
							};
							for (let method in v) {
								if (method && v.hasOwnProperty(method) && v[method] && method !== "version") {
									if (v[method].length > 0) {
										addMethod(v[method], fixAcl, env, service, v.version, method);
									}
								}
							}
						}
					});
				};
				compareWithScope((result) => {
					aclResponse.fixList = result;
					let fixAcl = {};
					let env = envS.toUpperCase();
					fixAcl[env] = {};
					for (let service in aclFill[env]) {
						if (service && aclFill[env].hasOwnProperty(service) && aclFill[env][service]) {
							fixAcl[env][service] = {};
							if (aclFill[env][service].length > 0) {
								addOptions(aclFill[env][service], fixAcl, env, service);
							}
						}
					}
					aclResponse.aclFill[env] = fixAcl[env];
				});
				return cb();
			}
			
			function compareWithScope(cb) {
				let fixList = {};
				let serviceList = {};
				let groups = [];
				let scopeAcl = JSON.parse(JSON.stringify(aclResponse.scopeFill));
				let allServiceApis = JSON.parse(JSON.stringify(aclResponse.allServiceApis));
				async.eachSeries(allServiceApis, function (service, callback) {
					serviceList[service.name] = {};
					if (!service.versions) {
						service.versions = [];
					}
					async.eachSeries(service.versions, function (v, call) {
						serviceList[service.name][v.version] = {};
						serviceList[service.name]["%serviceGroup%"] = service.configuration.group;
						if (groups.indexOf(service.configuration.group) === -1) {
							groups.push(service.configuration.group);
						}
						if (v.apis) {
							async.eachSeries(v.apis, function (oneApi, apiCall) {
								serviceList[service.name][v.version][oneApi.v + "%%" + oneApi.m + "%%"] = { // this is used only to allow same rout different method
									m: oneApi.m,
									group: oneApi.group ? oneApi.group : "General"
								};
								return apiCall();
							}, call);
						} else {
							return call();
						}
					}, () => {
						let reformedScope = {};
						
						async.forEachOfSeries(scopeAcl, function (aclEnv, env, scopeCall) {
							fixList[env] = {};
							reFormPackACL(scopeAcl[env], (result) => {
								reformedScope = result;
								groups.forEach((oneGroup) => {
									fixList[env][oneGroup] = {};
								});
								for (let service in scopeAcl[env]) {
									if (scopeAcl[env].hasOwnProperty(service)) {
										if (serviceList && serviceList[service] && serviceList[service]["%serviceGroup%"]) {
											let group = serviceList[service]["%serviceGroup%"];
											if (aclResponse.serviceGroup.indexOf(group) === -1) {
												aclResponse.serviceGroup.push(group);
											}
											fixList[env][group][service] = {};
											for (let version in scopeAcl[env][service]) {
												if (version && scopeAcl[env][service].hasOwnProperty(version)) {
													fixList[env][group][service][version] = {};
													if (scopeAcl[env][service].hasOwnProperty(version)) {
														if (scopeAcl[env][service][version].apisPermission === "restricted") {
															fixList[env][group][service][version] = reformedScope[service][version];
														} else {
															for (let api in serviceList[service][version]) {
																if (api !== "%serviceGroup%" && serviceList[service][version].hasOwnProperty(api) && serviceList[service][version] && serviceList[service][version][api]) {
																	if (!fixList[env][group][service][version][serviceList[service][version][api].group]) {
																		fixList[env][group][service][version][serviceList[service][version][api].group] = [];
																	}
																	if (fixList[env][group][service][version][serviceList[service][version][api].group].indexOf(serviceList[service][version][api].m) === -1) {
																		fixList[env][group][service][version][serviceList[service][version][api].group].push(serviceList[service][version][api].m);
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
								scopeCall();
							});
						}, callback);
					});
				}, () => {
					return cb(fixList);
				});
			}
			
			function reFormPackACL(acl, cb) {
				let newForm = {};
				let addApis = (value, service, version, method) => {
					value.forEach((oneMethod) => {
						if (oneMethod.group && oneMethod.apis) {
							if (!newForm[service][version][oneMethod.group]) {
								newForm[service][version][oneMethod.group] = [];
							}
							if (newForm[service][version][oneMethod.group].indexOf(method) === -1) {
								newForm[service][version][oneMethod.group].push(method);
							}
						}
					});
				};
				if (acl && Object.keys(acl).length > 0) {
					async.forEachOfSeries(acl, function (aclService, service, callback) {
						newForm[service] = {};
						async.forEachOfSeries(aclService, function (oneVersion, version, versionCall) {
							newForm[service][version] = {};
							if (oneVersion.apisPermission) {
								newForm[service][version].apisPermission = oneVersion.apisPermission;
							}
							for (let method in oneVersion) {
								if (method && oneVersion.hasOwnProperty(method) && oneVersion[method] && ['access', 'apisPermission'].indexOf(method) === -1 && oneVersion[method].length > 0) {
									addApis(acl[service][version][method], service, version, method);
								}
							}
							versionCall();
						}, callback);
					}, function () {
						return cb(newForm);
					});
				} else {
					return cb(newForm);
				}
			}
			
			function reFormPackageAclGranular(acl, cb) {
				let newForm = {};
				if (acl && Object.keys(acl).length > 0) {
					for (let service in acl) {
						if (acl.hasOwnProperty(service) && acl[service]) {
							newForm[service] = {};
							for (let version in acl[service]) {
								if (acl[service].hasOwnProperty(version) && acl[service][version]) {
									newForm[service][version] = {};
									if (acl[service][version].hasOwnProperty('apisPermission')) {
										newForm[service][version].apisPermission = acl[service][version].apisPermission;
									}
									if (acl[service][version].hasOwnProperty('access')) {
										newForm[service][version].access = acl[service][version].access;
									}
									for (let method in acl[service][version]) {
										if (method && acl[service][version].hasOwnProperty(method) && acl[service][version][method] && ['access', 'apisPermission'].indexOf(method) === -1) {
											if (!newForm[service][version][method]) {
												newForm[service][version][method] = {};
											}
											if (acl[service][version][method].apis && Object.keys(acl[service][version][method].apis).length > 0) {
												for (let api in acl[service][version][method].apis) {
													if (api && acl[service][version][method].apis.hasOwnProperty(api) && acl[service][version][method].apis[api] && acl[service][version][method].apis[api].group) {
														if (!newForm[service][version][method][acl[service][version][method].apis[api].group]) {
															newForm[service][version][method][acl[service][version][method].apis[api].group] = {
																apis: {}
															};
														}
														let accessObject = {};
														if (acl[service][version][method].apis[api].hasOwnProperty('access')) {
															accessObject.access = acl[service][version][method].apis[api].access;
														}
														newForm[service][version][method][acl[service][version][method].apis[api].group].apis[api] = accessObject;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				return cb(newForm);
			}
			
			function applyGranular(body, env, cb) {
				async.eachSeries(body.data.records, function (item, callback) {
					let acl = [];
					if (item && item.configuration && item.configuration.group) {
						if (!aclResponse.allServiceApisGranular[item.configuration.group]) {
							aclResponse.allServiceApisGranular[item.configuration.group] = [];
						}
						if (!aclResponse.paginations[item.configuration.group]) {
							aclResponse.paginations[item.configuration.group] = {
								currentPage: 1,
								totalItems: 1
							};
						} else {
							aclResponse.paginations[item.configuration.group].totalItems++;
						}
						if (item.versions) {
							async.eachSeries(item.versions, function (value, call) {
								if (value) {
									if (aclResponse.serviceGroup.indexOf(item.configuration.group) === -1) {
										aclResponse.serviceGroup.push(item.configuration.group);
									}
									groupApisForDisplay(value.apis, 'group', (result) => {
										let aclVersion = result;
										aclVersion["%v%"] = value.version;
										aclVersion["%showApi%"] = false;
										acl.push(aclVersion);
										return call();
									});
								} else {
									return call();
								}
							}, function () {
								let newItem = {
									"type": item.type,
									"name": item.name,
									"group": item.configuration.group,
									"versions": item.versions
								};
								newItem.fixList = acl;
								async.detect(aclResponse.allServiceApisGranular[item.configuration.group], function(group, callback) {
									return callback(null, group.name === newItem.name && group.type === newItem.type && group.group === newItem.group)
								}, function(err, result) {
									if(!result){
										aclResponse.allServiceApisGranular[item.configuration.group].push(newItem);
									}
									return callback();
								});
							});
						} else {
							return callback();
						}
					} else {
						return callback();
					}
				}, function () {
					let myAcl = {};
					reFormPackageAclGranular(aclResponse.aclFill[env.toUpperCase()], (result) => {
						myAcl[env.toUpperCase()] = result;
						async.forEachOfSeries(myAcl[env.toUpperCase()], function (service, serviceName, serviceCall) {
							let currentService = {};
							//need to optimize this search with async
							for (let group in aclResponse.allServiceApisGranular) {
								if (group && aclResponse.allServiceApisGranular[group]) {
									for (let x = 0; x < aclResponse.allServiceApisGranular[group].length; x++) {
										if (aclResponse.allServiceApisGranular[group][x].name === serviceName) {
											currentService = aclResponse.allServiceApisGranular[group][x];
											break;
										}
									}
								}
							}
							async.series([
								function (callback) {
									fillServiceAccess(service, currentService, callback);
								},
								function (callback) {
									fillServiceApiAccess(service, currentService, callback);
								}
							], serviceCall);
						}, function () {
							aclResponse.aclFill[env.toUpperCase()] = myAcl[env.toUpperCase()];
							return cb(null, aclResponse);
						});
					});
				});
			}
		});
	}
	
};

module.exports = bl;