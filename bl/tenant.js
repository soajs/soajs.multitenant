/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const async = require('async');
const request = require("request");

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

function getRequestedSubElementsPositions(tenantRecord, inputmaskData) {
	let found = false;
	let position = [];
	
	//find the application
	if (tenantRecord.applications) {
		for (let i = 0; i < tenantRecord.applications.length; i++) {
			if (tenantRecord.applications[i] && tenantRecord.applications[i].appId &&
				tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
				position.push(i); //application position found
				
				//if key is requested, go one level deeper
				if (inputmaskData.key) {
					
					//find the key
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							position.push(j); //application key position found
							
							//if extKey is requested, go one level deeper
							if (inputmaskData.extKey && inputmaskData.extKeyEnv && tenantRecord.applications[i].keys[j] &&
								tenantRecord.applications[i].keys[j].extKeys) {
								//find the ext key
								for (let k = 0; k < tenantRecord.applications[i].keys[j].extKeys.length; k++) {
									if (tenantRecord.applications[i].keys[j].extKeys[k].extKey === inputmaskData.extKey && tenantRecord.applications[i].keys[j].extKeys[k].env === inputmaskData.extKeyEnv) {
										position.push(k); //application extKey found
										
										//no need to go further, simply return
										found = true;
										break;
									}
								}
							}
							//else return what is found
							else {
								found = true;
								break;
							}
						}
					}
				}
				//else return what is found
				else {
					found = true;
					break;
				}
			}
		}
	}
	return {'found': found, 'position': position};
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
	 * tenant
	 */
	
	"tenants_product_extKeys": (soajs, inputmaskData, cb) => {
		if (!inputmaskData || !inputmaskData.tenants || !inputmaskData.tenants.tenant || !inputmaskData.tenants.tenant.code || !inputmaskData.productCode || !inputmaskData.env) {
			return cb(bl.handleError(soajs, 400, null));
		}
		
		let buildKeyObj = (record) => {
			let t_obj = {
				"code": record.code,
				"id": record._id,
				"extKeys": []
			};
			if (record.tenant) {
				t_obj.tenant = record.tenant;
			}
			if (inputmaskData.profile && record.profile) {
				t_obj.profile = record.profile;
			}
			for (let a = 0; a < record.applications.length; a++) {
				if (record.applications[a].product === inputmaskData.productCode) {
					t_obj.product = record.applications[a].product;
					t_obj.package = record.applications[a].package;
					if (record.applications[a].keys) {
						for (let k = 0; k < record.applications[a].keys.length; k++) {
							if (record.applications[a].keys[k].extKeys) {
								for (let ek = 0; ek < record.applications[a].keys[k].extKeys.length; ek++) {
									delete record.applications[a].keys[k].extKeys[ek].device;
									delete record.applications[a].keys[k].extKeys[ek].geo;
									delete record.applications[a].keys[k].extKeys[ek].dashboardAccess;
									if (record.applications[a].keys[k].extKeys[ek].env) {
										if (record.applications[a].keys[k].extKeys[ek].env.toLowerCase() === inputmaskData.env.toLowerCase()) {
											t_obj.extKeys.push(record.applications[a].keys[k].extKeys[ek]);
										}
									} else {
										t_obj.extKeys.push(record.applications[a].keys[k].extKeys[ek]);
									}
								}
							}
						}
					}
				}
			}
			return t_obj;
		};
		
		let response = {};
		let consoleTenant = !!inputmaskData.soajs;
		let data = {
			code: inputmaskData.tenants.tenant.code,
			soajs: consoleTenant
		};
		let modelObj = bl.mp.getModel(soajs);
		modelObj.getTenant(data, (err, record) => {
			if (record) {
				response.tenant = buildKeyObj(record);
			}
			
			if (inputmaskData.tenants.allowedTenants) {
				let tenants_code_array = [];
				for (let i = 0; i < inputmaskData.tenants.allowedTenants.length; i++) {
					if (inputmaskData.tenants.allowedTenants[i].tenant && inputmaskData.tenants.allowedTenants[i].tenant.code) {
						tenants_code_array.push(inputmaskData.tenants.allowedTenants[i].tenant.code);
					}
				}
				if (tenants_code_array.length > 0) {
					let data = {
						codes: tenants_code_array,
						soajs: consoleTenant
					};
					modelObj.getTenants(data, (err, records) => {
						if (records && records.length > 0) {
							response.allowedTenants = [];
							for (let t = 0; t < records.length; t++) {
								response.allowedTenants.push(buildKeyObj(records[t]));
							}
						}
						bl.mp.closeModel(soajs, modelObj);
						return cb(null, response);
					});
				} else {
					bl.mp.closeModel(soajs, modelObj);
					return cb(null, response);
				}
			} else {
				bl.mp.closeModel(soajs, modelObj);
				return cb(null, response);
			}
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
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, null));
			}
			return cb(null, record);
		});
	},
	
	"list": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		
		let data = {};
		data.type = inputmaskData.type;
		data.keywords = inputmaskData.keywords;
		data.start = inputmaskData.start;
		data.limit = inputmaskData.limit;
		
		modelObj.listTenants(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, record ? record : []);
		});
	},
	"listTenantSubTenants": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		
		let data = {};
		data.code = inputmaskData.code;
		data.keywords = inputmaskData.keywords;
		data.start = inputmaskData.start;
		data.limit = inputmaskData.limit;
		
		modelObj.listTenantSubTenants(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, record ? record : []);
		});
	},
	
	"listConsole": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.type = inputmaskData.type;
		
		modelObj.listConsoleTenants(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, record ? record : []);
		});
	},
	
	"getApplication": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!tenantRecord) {
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!tenantRecord.applications) {
				return cb(bl.handleError(soajs, 457, null));
			}
			let application;
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					application = tenantRecord.applications[i];
					break;
				}
			}
			if (application) {
				return cb(null, application);
			} else {
				return cb(bl.handleError(soajs, 457, null));
			}
		});
	},
	
	"listApplications": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			return cb(null, record.applications ? record.applications : []);
		});
	},
	
	"listApplicationKeys": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			let keys = [];
			if (record.applications) {
				record.applications.forEach(function (oneApplication) {
					if (oneApplication.appId.toString() === inputmaskData.appId) {
						keys = oneApplication.keys;
					}
				});
			}
			return cb(null, keys);
		});
	},
	
	"listApplicationExtKeys": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!tenantRecord) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			if (!tenantRecord.applications) {
				return cb(null, []);
			}
			let extKeys = [];
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId || !tenantRecord.applications[i].keys) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							if (!tenantRecord.applications[i].keys[j].extKeys) {
								continue;
							}
							extKeys = tenantRecord.applications[i].keys[j].extKeys;
							break;
						}
					}
				}
			}
			return cb(null, extKeys);
		});
	},
	
	"listApplicationKeyConfig": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			let x = getRequestedSubElementsPositions(record, inputmaskData);
			if (x.found && x.position.length === 2) {
				return cb(null, record.applications[x.position[0]].keys[x.position[1]].config);
			} else {
				return cb(null, {});
			}
		});
	},
	
	"add": (soajs, inputmaskData, core, cb) => {
		const provision = core.provision;
		const soajsCore = core.core;
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let record = {
			"_id": modelObj.generateId(),
			"type": inputmaskData.type,
			"name": inputmaskData.name,
			"description": inputmaskData.description,
			"oauth": {
				"secret": 'this is a secret',
				"redirectURI": 'http://domain.com',
				"grants": ["password", "refresh_token"],
				"disabled": 1,
				"type": 2,
				"loginMode": "urac"
			},
			"console": !!inputmaskData.soajs,
			"applications": []
		};
		if (inputmaskData.code) {
			record.code = inputmaskData.code;
		}
		if (inputmaskData.oauth) {
			record.oauth = inputmaskData.oauth;
		}
		if (inputmaskData.profile) {
			record.profile = inputmaskData.profile;
		}
		if (inputmaskData.tag) {
			record.tag = inputmaskData.tag;
		}
		async.series({
			checkIfExist: checkIfExist,
			checkSubTenant: checkSubTenant,
			checkApplication: checkApplication,
			checkCode: checkCode,
			insertRecord: insertRecord,
		}, (err, result) => {
			//err is handled and returned in each function above
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(err, null);
			} else {
				return cb(null, result.insertRecord);
			}
		});
		
		function checkIfExist(callback) {
			let opts = {};
			opts.name = inputmaskData.name;
			if (inputmaskData.code) {
				opts.code = inputmaskData.code;
			}
			modelObj.countTenants(opts, (err, count) => {
				if (err) {
					return callback(bl.handleError(soajs, 602, err));
				}
				if (count > 0) {
					return callback(bl.handleError(soajs, 451, null));
				}
				return callback(null);
			});
		}
		
		function checkSubTenant(callback) {
			if (inputmaskData.type === "product") {
				return callback(null);
			} else {
				let opt = {};
				if (inputmaskData.mainTenant) {
					opt.id = inputmaskData.mainTenant;
				} else {
					if (soajs.tenant.type === "client") {
						opt.id = soajs.tenant.main.id;
					} else {
						opt.id = soajs.tenant.id;
					}
				}
				opt.soajs = !!inputmaskData.soajs;
				modelObj.getTenant(opt, (err, mainTenant) => {
					if (err) {
						return callback(bl.handleError(soajs, 602, err));
					}
					if (!mainTenant || !mainTenant.code) {
						return callback(bl.handleError(soajs, 453, null));
					}
					record.tenant = {
						id: mainTenant._id.toString(),
						code: mainTenant.code
					};
					//inherit form main tenant if oauth was not provided
					if (!inputmaskData.oauth && mainTenant.oauth) {
						record.oauth = mainTenant.oauth;
					}
					return callback(null);
				});
			}
		}
		
		function checkCode(callback) {
			if (record.code) {
				return callback(null);
			}
			record.code = calculateCode(bl.localConfig.tenant.generatedCodeLength);
			return callback(null);
		}
		
		function calculateCode(length) {
			let code = '';
			for (let i = 0; i < length; i++) {
				code += bl.localConfig.tenant.character.charAt(Math.floor(Math.random() * bl.localConfig.tenant.character.length));
			}
			return code;
		}
		
		function checkApplication(callback) {
			if (!inputmaskData.application) {
				return callback(null);
			} else {
				if (!inputmaskData.application._TTL) {
					inputmaskData.application._TTL = 168;
				}
				let newApplication = {
					"product": inputmaskData.application.productCode,
					"package": inputmaskData.application.productCode + '_' + inputmaskData.application.packageCode,
					"appId": modelObj.generateId(),
					"description": inputmaskData.application.description || '',
					"_TTL": inputmaskData.application._TTL * 3600 * 1000, // 24 hours
					"keys": []
				};
				
				let oneKey = {};
				createOrUseKey(function (error, internalKey) {
					if (error) {
						return callback(bl.handleError(soajs, 602, error));
					}
					if (!internalKey) {
						record.applications.push(newApplication);
						return callback(null);
					}
					oneKey.key = internalKey;
					oneKey.config = inputmaskData.application.appKey.config ? inputmaskData.application.appKey.config : {};
					oneKey.extKeys = [];
					newApplication.keys.push(oneKey);
					record.applications.push(newApplication);
					if (inputmaskData.application && inputmaskData.application.appKey && inputmaskData.application.appKey.extKey) {
						createExternalKey((error, extKey) => {
							if (error) {
								return callback(error);
							} else {
								if (extKey) {
									record.applications[0].keys[0].extKeys.push(extKey);
								}
								return callback(null);
							}
						});
					} else {
						return callback(null);
					}
				});
			}
		}
		
		function createOrUseKey(callback) {
			if (inputmaskData.application.appKey) {
				provision.generateInternalKey(callback);
			} else {
				return callback(null);
			}
		}
		
		function createExternalKey(callback) {
			if (inputmaskData.application && inputmaskData.application.appKey && inputmaskData.application.appKey.extKey) {
				soajs.awareness.connect("console", "1", (response) => {
					let options = {
						uri: 'http://' + response.host + "/registry/key",
						headers: response.headers,
						qs: {"env": inputmaskData.application.appKey.extKey.env.toLowerCase()},
						json: true
					};
					request.get(options, function (error, response, body) {
						if (error || !body.result) {
							return callback(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						let envKey = body.data;
						if (!envKey) {
							return callback(bl.handleError(soajs, 501, null));
						}
						
						soajsCore.key.generateExternalKey(
							record.applications[0].keys[0].key,
							{
								id: record._id,
								"locked": false
							},
							{
								"package": inputmaskData.application.productCode + '_' + inputmaskData.application.packageCode
							},
							envKey,
							function (error, extKeyValue) {
								if (error) {
									return callback(bl.handleError(soajs, 502, error));
								}
								let newExtKey = {
									"extKey": extKeyValue,
									"device": inputmaskData.application.appKey.extKey.device ? inputmaskData.application.appKey.extKey.device : null,
									"geo": inputmaskData.application.appKey.extKey.geo ? inputmaskData.application.appKey.extKey.geo : null,
									"env": inputmaskData.application.appKey.extKey.env.toUpperCase(),
									"label": inputmaskData.application.appKey.extKey.label,
									"expDate": (inputmaskData.application.appKey.extKey.expDate) ? new Date(inputmaskData.application.appKey.extKey.expDate).getTime() + bl.localConfig.tenant.expDateTTL : null
								};
								return callback(null, newExtKey);
							}
						);
					});
				});
			} else {
				return callback(null, null);
			}
		}
		
		function insertRecord(callback) {
			modelObj.addTenant(record, (err, response) => {
				if (err) {
					if (err.message && err.message.indexOf("code_1 dup key") !== -1 && !inputmaskData.code) {
						record.code = calculateCode(bl.localConfig.tenant.generatedCodeLength);
						insertRecord(callback);
					} else {
						return callback(bl.handleError(soajs, 602, err), null);
					}
				} else {
					return callback(null, response);
				}
			});
		}
	},
	
	"addApplication": (soajs, inputmaskData, core, cb) => {
		const provision = core.provision;
		const soajsCore = core.core;
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		
		function createExternalKey(opt, callback) {
			if (inputmaskData.appKey.extKey) {
				soajs.awareness.connect("console", "1", (response) => {
					let options = {
						uri: 'http://' + response.host + "/registry/key",
						headers: response.headers,
						qs: {"env": inputmaskData.appKey.extKey.env.toLowerCase()},
						json: true
					};
					request.get(options, function (error, response, body) {
						if (error || !body.result) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						let envKey = body.data;
						if (!envKey) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 501, null));
						}
						soajsCore.key.generateExternalKey(opt.key, {
							"id": opt.id,
							"code": opt.code,
							"locked": false
						}, {
							"product": opt.product,
							"package": opt.package,
							"appId": opt.appId,
						}, envKey, function (error, extKeyValue) {
							if (error) {
								bl.mp.closeModel(soajs, modelObj);
								return cb(bl.handleError(soajs, 502, error));
							}
							let newExtKey = {
								"extKey": extKeyValue,
								"device": inputmaskData.appKey.extKey.device ? inputmaskData.appKey.extKey.device : null,
								"geo": inputmaskData.appKey.extKey.geo ? inputmaskData.appKey.extKey.geo : null,
								"env": inputmaskData.appKey.extKey.env.toUpperCase(),
								"label": inputmaskData.appKey.extKey.label,
								"expDate": (inputmaskData.appKey.extKey.expDate) ? new Date(inputmaskData.appKey.extKey.expDate).getTime() + bl.localConfig.tenant.expDateTTL : null
							};
							return callback(null, newExtKey);
						});
					});
				});
			} else {
				return callback(null, null);
			}
		}
		
		function generateKey(app, tenantRecord, callback) {
			if (!inputmaskData.appKey) {
				return callback();
			}
			provision.generateInternalKey(function (error, internalKey) {
				if (error) {
					return cb(bl.handleError(soajs, 602, error));
				}
				let key = {
					key: internalKey,
					config: inputmaskData.appKey.config ? inputmaskData.appKey.config : {},
					extKeys: []
				};
				let opt = {
					"code": tenantRecord.code,
					"id": tenantRecord._id,
					"appId": app.appId.toString(),
					"product": app.product,
					"package": app.package,
					"key": internalKey
				};
				createExternalKey(opt, (error, extKey) => {
					let externalKey = null;
					if (extKey) {
						key.extKeys.push(extKey);
						externalKey = extKey.extKey;
					}
					app.keys.push(key);
					return callback(null, internalKey, externalKey);
				});
			});
		}
		
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!tenantRecord.applications) {
				tenantRecord.applications = [];
			}
			if (!inputmaskData._TTL) {
				inputmaskData._TTL = 168;
			}
			let newApplication = {
				"product": inputmaskData.productCode,
				"package": inputmaskData.productCode + '_' + inputmaskData.packageCode,
				"appId": modelObj.generateId(),
				"description": inputmaskData.description || '',
				"_TTL": inputmaskData._TTL * 3600 * 1000, // 24 hours
				"keys": []
			};
			generateKey(newApplication, tenantRecord, (err, internalKey, externalKey) => {
				tenantRecord.applications.push(newApplication);
				data = {
					_id: tenantRecord._id,
					applications: tenantRecord.applications
				};
				modelObj.updateTenant(data, (err) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 471, err));
					}
					return cb(null, {
							intKey: internalKey ? internalKey : 1,
							extKey: externalKey ? externalKey : 1,
							appId: newApplication.appId
						}
					);
				});
			});
			
		});
	},
	
	"addApplicationKey": (soajs, inputmaskData, core, cb) => {
		const provision = core.provision;
		const soajsCore = core.core;
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		
		function createExternalKey(opt, callback) {
			if (inputmaskData.extKey) {
				soajs.awareness.connect("console", "1", (response) => {
					let options = {
						uri: 'http://' + response.host + "/registry/key",
						headers: response.headers,
						qs: {"env": inputmaskData.extKey.env.toLowerCase()},
						json: true
					};
					request.get(options, function (error, response, body) {
						if (error || !body.result) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						let envKey = body.data;
						if (!envKey) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 501, null));
						}
						soajsCore.key.generateExternalKey(opt.key, {
							"id": opt.id,
							"code": opt.code,
							"locked": false
						}, {
							"product": opt.product,
							"package": opt.package,
							"appId": opt.appId,
						}, envKey, function (error, extKeyValue) {
							if (error) {
								bl.mp.closeModel(soajs, modelObj);
								return cb(bl.handleError(soajs, 502, error));
							}
							let newExtKey = {
								"extKey": extKeyValue,
								"device": inputmaskData.extKey.device ? inputmaskData.extKey.device : null,
								"geo": inputmaskData.extKey.geo ? inputmaskData.extKey.geo : null,
								"env": inputmaskData.extKey.env.toUpperCase(),
								"label": inputmaskData.extKey.label,
								"expDate": (inputmaskData.extKey.expDate) ? new Date(inputmaskData.extKey.expDate).getTime() + bl.localConfig.tenant.expDateTTL : null
							};
							return callback(null, newExtKey);
						});
					});
				});
			} else {
				return callback(null, null);
			}
		}
		
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			let found = false;
			if (!tenantRecord.applications) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			let key = {};
			async.each(tenantRecord.applications, function (application, callback) {
				if (application.appId && application.appId.toString() === inputmaskData.appId) {
					found = true;
					provision.generateInternalKey(function (error, internalKey) {
						if (error) {
							return cb(bl.handleError(soajs, 602, error));
						}
						key.key = internalKey;
						key.config = inputmaskData.config ? inputmaskData.config : {};
						key.extKeys = [];
						let opt = {
							"code": tenantRecord.code,
							"id": tenantRecord._id,
							"appId": inputmaskData.appId,
							"product": application.product,
							"package": application.package,
							"key": internalKey
						};
						createExternalKey(opt, (error, extKey) => {
							if (extKey) {
								key.extKeys.push(extKey);
							}
							application.keys.push(key);
							return callback();
						});
					});
				} else {
					return callback();
				}
			}, function () {
				if (!found) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 472, null));
				}
				data = {
					_id: tenantRecord._id,
					applications: tenantRecord.applications
				};
				modelObj.updateTenant(data, (err, response) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 471, err));
					}
					return cb(null, response);
				});
			});
		});
	},
	
	"addApplicationExtKey": (soajs, inputmaskData, core, cb) => {
		const soajsCore = core.core;
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		
		function createExternalKey(opt, callback) {
			soajs.awareness.connect("console", "1", (response) => {
				let options = {
					uri: 'http://' + response.host + "/registry/key",
					headers: response.headers,
					qs: {"env": inputmaskData.env.toLowerCase()},
					json: true
				};
				request.get(options, function (error, response, body) {
					if (error || !body.result) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					let envKey = body.data;
					if (!envKey) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 501, null));
					}
					soajsCore.key.generateExternalKey(opt.key, {
						"id": opt.id,
						"code": opt.code,
						"locked": false
					}, {
						"product": opt.product,
						"package": opt.package,
						"appId": opt.appId,
					}, envKey, function (error, extKeyValue) {
						if (error) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 502, error));
						}
						let newExtKey = {
							"extKey": extKeyValue,
							"device": inputmaskData.device ? inputmaskData.device : null,
							"geo": inputmaskData.geo ? inputmaskData.geo : null,
							"env": inputmaskData.env.toUpperCase(),
							"label": inputmaskData.label,
							"expDate": (inputmaskData.expDate) ? new Date(inputmaskData.expDate).getTime() + bl.localConfig.tenant.expDateTTL : null
						};
						return callback(null, newExtKey);
					});
				});
			});
		}
		
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			let found = false;
			if (!tenantRecord.applications) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			async.each(tenantRecord.applications, function (application, callback) {
				if (application.appId && application.appId.toString() === inputmaskData.appId) {
					async.each(application.keys, function (oneKey, call) {
						if (oneKey.key === inputmaskData.key) {
							found = true;
							let opt = {
								"code": tenantRecord.code,
								"id": tenantRecord._id,
								"appId": inputmaskData.appId,
								"product": application.product,
								"package": application.package,
								"key": inputmaskData.key
							};
							createExternalKey(opt, (error, extKey) => {
								if (extKey) {
									if (!oneKey.extKeys) {
										oneKey.extKeys = [];
									}
									oneKey.extKeys.push(extKey);
								}
								return call();
							});
						} else {
							return call();
						}
					}, callback);
				} else {
					return callback();
				}
			}, function () {
				if (!found) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 473, null));
				}
				data = {
					_id: tenantRecord._id,
					applications: tenantRecord.applications
				};
				modelObj.updateTenant(data, (err, response) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 471, err));
					}
					return cb(null, response);
				});
			});
		});
	},
	
	"updateTenant": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data = {
				_id: record._id
			};
			if (inputmaskData.tag) {
				data.tag = inputmaskData.tag;
			}
			if (inputmaskData.name) {
				data.name = inputmaskData.name;
			}
			if (inputmaskData.description) {
				data.description = inputmaskData.description;
			}
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateProfile": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data = {
				_id: record._id,
				profile: inputmaskData.profile
			};
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateApplication": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null), null);
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			let found = false;
			if (!tenantRecord.applications) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					if (inputmaskData.description) {
						tenantRecord.applications[i].description = inputmaskData.description;
					}
					if (inputmaskData.packageCode) {
						tenantRecord.applications[i].package = tenantRecord.applications[i].product + "_" + inputmaskData.packageCode;
					}
					if (inputmaskData._TTL) {
						tenantRecord.applications[i]._TTL = inputmaskData._TTL * 3600 * 1000;
					}
					found = true;
					break;
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			data = {
				_id: tenantRecord._id,
				applications: tenantRecord.applications
			};
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateApplicationKey": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, err), null);
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			if (!tenantRecord.applications) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			let found = false;
			
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId || !tenantRecord.applications[i].keys) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							tenantRecord.applications[i].keys[j].config = inputmaskData.config;
							found = true;
							break;
						}
					}
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 473, null));
			}
			data = {
				_id: tenantRecord._id,
				applications: tenantRecord.applications
			};
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateApplicationExternalKey": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, err), null);
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			let found = false;
			if (!tenantRecord.applications) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 472, null));
			}
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId || !tenantRecord.applications[i].keys) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							if (!tenantRecord.applications[i].keys[j].extKeys) {
								continue;
							}
							for (let x = 0; x < tenantRecord.applications[i].keys[j].extKeys.length; x++) {
								if (!tenantRecord.applications[i].keys[j].extKeys[x]) {
									continue;
								}
								if (tenantRecord.applications[i].keys[j].extKeys[x].extKey === inputmaskData.extKey) {
									if (inputmaskData.device) {
										tenantRecord.applications[i].keys[j].extKeys[x].device = inputmaskData.device;
									}
									if (inputmaskData.geo) {
										tenantRecord.applications[i].keys[j].extKeys[x].geo = inputmaskData.geo;
									}
									if (inputmaskData.expDate) {
										tenantRecord.applications[i].keys[j].extKeys[x].expDate = inputmaskData.expDate;
									}
									if (inputmaskData.extKeyEnv) {
										tenantRecord.applications[i].keys[j].extKeys[x].env = inputmaskData.extKeyEnv.toUpperCase();
									}
									if (inputmaskData.label) {
										tenantRecord.applications[i].keys[j].extKeys[x].label = inputmaskData.label;
									}
									found = true;
									break;
								}
							}
						}
					}
				}
			}
			if (!found) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 473, null));
			}
			data = {
				_id: tenantRecord._id,
				applications: tenantRecord.applications
			};
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
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
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (record._id && record._id.toString() === soajs.tenant.id) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 462, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data._id = record._id;
			modelObj.deleteTenant(data, (err, result) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, result);
			});
		});
	},
	
	"deleteApplication": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.code = inputmaskData.code;
		data.id = inputmaskData.id;
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (record._id && record._id.toString() === soajs.tenant.id) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 462, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data = {
				_id: record._id,
				appId: inputmaskData.appId
			};
			modelObj.removeApplication(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"deleteApplicationKey": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.code = inputmaskData.code;
		data.id = inputmaskData.id;
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (record._id && record._id.toString() === soajs.tenant.id) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 462, null));
			}
			if (!soajs.tenant.locked && record && record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			data = {
				_id: record._id,
				appId: inputmaskData.appId,
				key: inputmaskData.key
			};
			modelObj.removeApplicationKey(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"deleteApplicationExternalKey": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.code = inputmaskData.code;
		data.id = inputmaskData.id;
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, tenantRecord) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!tenantRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 450, null));
			}
			if (tenantRecord._id && tenantRecord._id.toString() === soajs.tenant.id) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 462, null));
			}
			if (!soajs.tenant.locked && tenantRecord && tenantRecord.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 500, null));
			}
			let found = 0;
			if (!tenantRecord.applications) {
				return cb(null, found);
			}
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (!tenantRecord.applications[i] || !tenantRecord.applications[i].appId || !tenantRecord.applications[i].keys) {
					continue;
				}
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							if (!tenantRecord.applications[i].keys[j].extKeys) {
								continue;
							}
							for (let x = 0; x < tenantRecord.applications[i].keys[j].extKeys.length; x++) {
								if (!tenantRecord.applications[i].keys[j].extKeys[x]) {
									continue;
								}
								if (tenantRecord.applications[i].keys[j].extKeys[x].extKey === inputmaskData.extKey) {
									tenantRecord.applications[i].keys[j].extKeys.splice(x, 1);
									found = 1;
									break;
								}
							}
						}
					}
				}
			}
			if (found === 0) {
				return cb(null, found);
			}
			data = {
				_id: tenantRecord._id,
				applications: tenantRecord.applications
			};
			modelObj.updateTenant(data, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateApplicationKeyConfig": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			let x = getRequestedSubElementsPositions(record, inputmaskData);
			//check config input for throttling null entries
			for (let service in inputmaskData.config) {
				if (service && inputmaskData.config.hasOwnProperty(service)) {
					if (inputmaskData.config[service] && inputmaskData.config.hasOwnProperty(service) &&
						inputmaskData.config[service].SOAJS && inputmaskData.config[service].SOAJS.THROTTLING) {
						for (let strategy in inputmaskData.config[service].SOAJS.THROTTLING) {
							if (inputmaskData.config[service].SOAJS.THROTTLING.hasOwnProperty(strategy)) {
								if (inputmaskData.config[service].SOAJS.THROTTLING[strategy] === 'null') {
									inputmaskData.config[service].SOAJS.THROTTLING[strategy] = null;
								} else if (inputmaskData.config[service].SOAJS.THROTTLING[strategy] === "--inherit--") {
									delete inputmaskData.config[service].SOAJS.THROTTLING[strategy];
								}
							}
						}
					}
					if (inputmaskData.config[service].SOAJS && Object.keys(inputmaskData.config[service].SOAJS).length === 0) {
						delete inputmaskData.config[service].SOAJS;
					}
				}
			}
			if (x.found && x.position.length === 2) {
				record.applications[x.position[0]].keys[x.position[1]].config[inputmaskData.envCode.toLowerCase()] = inputmaskData.config;
				if (Object.keys(record.applications[x.position[0]].keys[x.position[1]].config[inputmaskData.envCode.toLowerCase()]).length === 0) {
					delete record.applications[x.position[0]].keys[x.position[1]].config[inputmaskData.envCode.toLowerCase()];
				}
			}
			let opts = {
				_id: record._id,
				applications: record.applications
			};
			modelObj.updateTenant(opts, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
	
	"updateOauth": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
		data.soajs = !!inputmaskData.soajs;
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			if (!record.oauth) {
				record.oauth = {};
			}
			record.oauth.secret = inputmaskData.secret;
			if (inputmaskData.redirectURI) {
				record.oauth.redirectURI = inputmaskData.redirectURI;
			}
			record.oauth.grants = ["password", "refresh_token"];
			record.oauth.disabled = inputmaskData.oauthType === "off" ? 1 : 0;
			
			if (Object.hasOwnProperty.call(inputmaskData, 'type')) {
				record.oauth.type = inputmaskData.type;
			}
			if (inputmaskData.oauthType === "urac") {
				record.oauth.loginMode = "urac";
				if (inputmaskData.pin && typeof inputmaskData.pin === 'object' && Object.keys(inputmaskData.pin).length > 0) {
					let pin = {};
					for (let prod in inputmaskData.pin) {
						if (prod && inputmaskData.pin.hasOwnProperty(prod) &&
							inputmaskData.pin[prod] && inputmaskData.pin[prod].hasOwnProperty('enabled') &&
							typeof inputmaskData.pin[prod].enabled === 'boolean') {
							pin[prod] = {
								"enabled": inputmaskData.pin[prod].enabled
							};
						}
					}
					record.oauth.pin = pin;
				}
			}
			
			if (inputmaskData.oauthType === "miniurac") {
				record.oauth.loginMode = "oauth";
			}
			
			if (record.oauth.type === 0) {
				if (inputmaskData.oauthType === "urac") {
					return cb(bl.handleError(soajs, 459, err));
				}
			}
			
			let opts = {
				_id: record._id,
				oauth: record.oauth
			};
			modelObj.updateTenant(opts, (err, response) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 471, err));
				}
				return cb(null, response);
			});
		});
	},
};

module.exports = bl;