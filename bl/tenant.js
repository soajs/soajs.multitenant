'use strict';
const async = require('async');
const core = require('soajs');
let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	
	"handleError": (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err);
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
	
	"get": (soajs, inputmaskData, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let data = {};
		data.id = inputmaskData.id;
		data.code = inputmaskData.code;
		
		modelObj.getTenant(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
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
		
		modelObj.listTenants(data, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, record ? record : []);
		});
	},
	
	"add": (soajs, inputmaskData, cb) => {
		const provision = core.provision;
		const soajsCore = core.core;
		console.log("---------inputmaskData----------")
		console.log(JSON.stringify(inputmaskData, null, 2))
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs);
		let record = {
			"type": inputmaskData.type,
			"code": inputmaskData.code,
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
			"applications": []
		};
		let tenantCodes = [];
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
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, result.insertRecord);
		});
		
		function checkIfExist(callback) {
			let opts = {};
			opts.name = inputmaskData.name;
			if (inputmaskData.code) {
				opts.code = inputmaskData.code;
			}
			modelObj.countTenants(opts, (err, count) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (count > 0) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 451, null));
				}
				return callback(null);
			});
		}
		
		function checkSubTenant(callback) {
			if (inputmaskData.type === "product") {
				return callback(null);
			} else {
				if (!inputmaskData.mainTenant) {
					return cb(bl.handleError(soajs, 452, null));
				} else {
					let opt = {
						id: inputmaskData.mainTenant
					};
					modelObj.getTenant(opt, (err, mainTenant) => {
						if (err) {
							return cb(bl.handleError(soajs, 602, err));
						}
						if (!mainTenant || !mainTenant.code) {
							return cb(bl.handleError(soajs, 453, null));
						}
						record.tenant = {
							id: mainTenant._id.toString(),
							code: mainTenant.code,
						};
						//inherit form main tenant if oauth was not provided
						if (!record.oauth && mainTenant.oauth) {
							record.oauth = mainTenant.oauth;
						}
						return callback(null);
					});
				}
			}
		}
		
		function checkCode(callback) {
			if (record.code) {
				return callback(null);
			}
			let opts = {
				fields: ["code"]
			};
			modelObj.listAllTenants(opts, (err, tenants) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (tenants && tenants.length === 0) {
					tenants.forEach((oneTenant) => {
						tenantCodes.push(oneTenant.code);
					});
				}
				
				record.code = calculateCode(tenantCodes, bl.localConfig.tenant.generatedCodeLength);
				console.log("code ", record.code)
				return callback(null);
			});
		}
		
		function calculateCode(codes, length) {
			let code = '';
			for (let i = 0; i < length; i++) {
				code += bl.localConfig.tenant.character.charAt(Math.floor(Math.random() * bl.localConfig.tenant.character.length));
			}
			if (codes.indexOf(code) !== -1) {
				calculateCode(codes, length);
			} else {
				return code;
			}
		}
		
		function checkApplication(callback) {
			if (!inputmaskData.application) {
				console.log("no application found")
				return callback(null);
			} else {
				let newApplication = {
					"product": inputmaskData.productCode,
					"package": inputmaskData.productCode + '_' + inputmaskData.packageCode,
					"appId": modelObj.generateId(soajs),
					"description": inputmaskData.description || '',
					"_TTL": inputmaskData._TTL * 3600 * 1000, // 24 hours
					"keys": []
				};
				
				let oneKey = {};
				createOrUseKey(function (error, internalKey) {
					if (error) {
						return cb(bl.handleError(soajs, 602, null));
					}
					if (!internalKey) {
						record.applications.push(newApplication);
						return callback(null);
					}
					
					
					oneKey.key = internalKey;
					if (oneKey.application.config) {
						oneKey.config = oneKey.application.config;
					}
					oneKey.application.extKeys = [];
					createExternalKey(internalKey, function (error, extKey) {
						if (error) {
							return cb(bl.handleError(soajs, 602, null));
						}
						if (extKey) {
							oneKey.application.extKeys.push(extKey);
						}
						record.applications.push(newApplication);
					});
					
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
		
		function createExternalKey(internalKey, callback) {
			if (inputmaskData.application.appKey.extKey) {
				core.registry.loadByEnv({envCode: inputmaskData.application.appKey.extKey.env}, (err, envRecord) => {
					if (err) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 602, err));
					}
					if (!envRecord) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 501, null));
					}
					soajsCore.key.generateExternalKey(record.applications[0].keys[0].key, {
						id: record._id,
						code: record.code,
						locked: false
					}, {
						product: record.applications[0].product,
						package: record.applications[0].package,
						appId: record.applications[0].appId.toString(),
					}, envRecord.services.config.key, function (error, extKeyValue) {
						if (error) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 501, error));
						}
						let newExtKey = {
							"extKey": extKeyValue,
							"device": inputmaskData.application.extKey.device ? inputmaskData.application.extKey.device : null,
							"geo": inputmaskData.application.extKey.geo ? inputmaskData.application.extKey.geo : null,
							"env": envRecord.code.toUpperCase(),
							"dashboardAccess": false,
							"label": inputmaskData.application.extKey.label,
							"expDate": (inputmaskData.application.extKey.expDate) ? new Date(inputmaskData.application.extKey.expDate).getTime() + bl.localConfig.tenant.expDateTTL : null
						};
						return callback(null, newExtKey);
					});
				});
				
				
			} else {
				return callback(null);
			}
		}
		
		function insertRecord(callback) {
			console.log("insert Record")
			modelObj.addTenant(record, (err, response) => {
				if (err) {
					if (err.indexOf("code_1 dup key") !== -1 && !inputmaskData.code) {
						record.code = calculateCode(tenantCodes, bl.localConfig.tenant.generatedCodeLength);
						insertRecord(callback);
					} else {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 602, err), null);
					}
				}
				return callback(null, response);
			});
		}
	}
};

module.exports = bl;