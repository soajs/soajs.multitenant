'use strict';
const async = require('async');
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
		
		if (!data.id) {
			data.id = soajs.tenant.id;
		}
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
			createExternalKey: createExternalKey,
			insertRecord: insertRecord,
		}, (err, result) => {
			//err is handled and returned in each function above
			bl.mp.closeModel(soajs, modelObj);
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
			let opts = {
				fields: ["code"]
			};
			modelObj.listAllTenants(opts, (err, tenants) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (tenants && tenants.length !== 0) {
					tenants.forEach((oneTenant) => {
						tenantCodes.push(oneTenant.code);
					});
				}
				
				record.code = calculateCode(tenantCodes, bl.localConfig.tenant.generatedCodeLength);
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
				return callback(null);
			} else {
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
						return cb(bl.handleError(soajs, 602, error));
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
					createExternalKey((error, extKey) => {
						if (extKey) {
							record.applications[0].keys[0].extKeys.push(extKey);
						}
						return callback(null);
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
		
		function createExternalKey(callback) {
			if (inputmaskData.application && inputmaskData.application.appKey && inputmaskData.application.appKey.extKey) {
				soajsCore.registry.loadByEnv({envCode: inputmaskData.application.appKey.extKey.env.toUpperCase()}, (err, envRecord) => {
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
						"code": record.code,
						"locked": false
					}, {
						"product": inputmaskData.application.productCode,
						"package": inputmaskData.application.productCode + '_' + inputmaskData.application.packageCode,
						"appId": record.applications[0].appId.toString(),
					}, envRecord.serviceConfig.key, function (error, extKeyValue) {
						if (error) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 501, error));
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
						record.code = calculateCode(tenantCodes, bl.localConfig.tenant.generatedCodeLength);
						createExternalKey((err, extKey) => {
							if (extKey) {
								record.applications[0].keys[0].extKeys = [extKey];
							}
							insertRecord(callback);
						});
					} else {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 602, err), null);
					}
				} else {
					return callback(null, response);
				}
				
			});
		}
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
			
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					if (inputmaskData.description) {
						tenantRecord.applications[i].description = inputmaskData.description;
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
			
			for (let i = 0; i < tenantRecord.applications.length; i++) {
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
			
			for (let i = 0; i < tenantRecord.applications.length; i++) {
				if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
					for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
						if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
							for (let x = 0; x < tenantRecord.applications[i].keys[j].extKeys.length; x++) {
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
									tenantRecord.applications[i].keys[j].config = inputmaskData.config;
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
	}
};

module.exports = bl;