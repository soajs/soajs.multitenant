
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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

        modelObj.listTenants(data, (err, record) => {
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
                            return cb(bl.handleError(soajs, 502, error));
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
                soajsCore.registry.loadByEnv({envCode: inputmaskData.appKey.extKey.env.toUpperCase()}, (err, envRecord) => {
                    if (err) {
                        bl.mp.closeModel(soajs, modelObj);
                        return cb(bl.handleError(soajs, 602, err));
                    }
                    if (!envRecord) {
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
                    }, envRecord.serviceConfig.key, function (error, extKeyValue) {
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
                            extKey: externalKey ? externalKey : 1
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
                soajsCore.registry.loadByEnv({envCode: inputmaskData.extKey.env.toUpperCase()}, (err, envRecord) => {
                    if (err) {
                        bl.mp.closeModel(soajs, modelObj);
                        return cb(bl.handleError(soajs, 602, err));
                    }
                    if (!envRecord || !envRecord.serviceConfig || !envRecord.serviceConfig.key) {
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
                    }, envRecord.serviceConfig.key, function (error, extKeyValue) {
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
            } else {
                return callback(null, null);
            }
        }

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
            soajsCore.registry.loadByEnv({envCode: inputmaskData.env.toUpperCase()}, (err, envRecord) => {
                if (err) {
                    bl.mp.closeModel(soajs, modelObj);
                    return cb(bl.handleError(soajs, 602, err));
                }
                if (!envRecord || !envRecord.serviceConfig || !envRecord.serviceConfig.key) {
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
                }, envRecord.serviceConfig.key, function (error, extKeyValue) {
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
        }

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
    }
};

module.exports = bl;