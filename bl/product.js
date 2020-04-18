
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const core = require('soajs').core;
const validator = new core.validator.Validator();

const apiGroup = require("../schemas/aclApiGroup");
const granularAcl = require("../schemas/aclGranular");

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
		
		if (inputmaskData.scope){
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
			if (!record.packages){
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
			if (found){
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 467, null));
			}
			let newPackage = {
				"code": prefix + inputmaskData.code.toUpperCase(),
				"name": inputmaskData.name,
				"_TTL": inputmaskData._TTL * 3600 * 1000
			};
			
			if (inputmaskData.description){
				newPackage.description = inputmaskData.description;
			}
			if (inputmaskData.tags){
				newPackage.tags = inputmaskData.tags;
			}
			newPackage.acl = inputmaskData.acl ? inputmaskData.acl : {};
			if (inputmaskData.type){
				newPackage.aclType = inputmaskData.type;
			}
			if (newPackage.acl){
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
				if (!check.valid){
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
			if (!record.packages){
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			let found = false;
			let prefix = record.code.toUpperCase() + '_';
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code.toUpperCase() === prefix + inputmaskData.code) {
					if (inputmaskData.name){
						record.packages[i].name = inputmaskData.name;
					}
					if (inputmaskData.description){
						record.packages[i].description = inputmaskData.description;
					}
					if (inputmaskData._TTL){
						record.packages[i]._TTL = inputmaskData._TTL * 3600 * 1000;
					}
					if (inputmaskData.type ){
						record.packages[i].aclTypeByEnv = inputmaskData.type;
					}
					if (inputmaskData.acl){
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
						if (!check.valid){
							let message = `Invalid Acl of type ${record.packages[i].aclType === "granular" ? "Granular" : "Api Group"} provided!`;
							soajs.log.debug(check.errors);
							return cb({"code": "469", "msg": message});
						}
					}
					if (inputmaskData.tags){
						record.packages[i].tags = inputmaskData.tags;
					}
					found = true;
					break;
				}
			}
			if (!found){
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
			if (!record.packages){
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 461, null));
			}
			let found = false;
			let prefix = record.code.toUpperCase() + '_';
			for (let i = 0; i < record.packages.length; i++) {
				if (record.packages[i].code.toUpperCase() === prefix + inputmaskData.code) {
					record.packages[i].acl[inputmaskData.env.toLowerCase()] = inputmaskData.acl;
					if (inputmaskData.type){
						if (!record.packages[i].aclTypeByEnv){
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
					if (!check.valid){
						let message = `Invalid Acl of type ${record.packages[i].aclTypeByEnv === "granular" ? "Granular" : "Api Group"} provided!`;
						soajs.log.debug(check.errors);
						return cb({"code": "469", "msg": message});
					}
					found = true;
					break;
				}
			}
			if (!found){
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
			if (!record.packages){
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
			if (!found){
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
	}
 
};

module.exports = bl;