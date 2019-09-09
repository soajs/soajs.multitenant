'use strict';

let soajs = require("soajs");
const Auth = soajs.authorization;

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function calculateCode(codes, length) {
    let code = makeId(length);
    if (codes.indexOf(code) !== -1) {
        calculateCode(codes, length);
    } else {
        return code;
    }
}

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
            "msg": bl.localConfig.errors[errCode] + ((err && errCode === 473) ? err.message : "")
        });
    },

    "mp": {
        "getModel": (soajs) => {
            let l_modelObj = bl.modelObj;
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
            }
            return l_modelObj;
        },
        "closeModel": (soajs, l_modelObj) => {
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj.closeConnection();
            }
        }
    },

    "checkCanEdit": (l_modelObj, inputmaskData, cb) => {
        let uracDriver;
        let data = {};

        if (soajs.uracDriver && soajs.uracDriver.getProfile()) {
            uracDriver = soajs.uracDriver.getProfile();
        }

        if (inputmaskData.id) {
            if (uracDriver && uracDriver.tenant.id.toString() === inputmaskData.id.toString()) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(null, {});
            }
            data.id = inputmaskData.id;
            data.locked = true;

        } else if (inputmaskData.code) {
            if (uracDriver && uracDriver.tenant.code.toUpperCase() === inputmaskData.code.toUpperCase()) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(null, {});
            }

            data.code = inputmaskData.code;
            data.locked = true;
        }
        l_modelObj.getTenant(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 436, err));
            }

            if (record) { // root tenant
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 500, null));
            }
            return cb(null, {}); // Can update/delete not root tenant
        });
    },

    "getRequestedSubElementsPositions": (inputmaskData, tenantRecord) => {
        let found = false;
        let position = [];

        for (let i = 0; i < tenantRecord.applications.length; i++) {
            if (tenantRecord.applications[i].appId.toString() === inputmaskData.appId) {
                position.push(i); //application position found

                //if key is requested, go one level deeper
                if (inputmaskData.key) {

                    //find the key
                    for (let j = 0; j < tenantRecord.applications[i].keys.length; j++) {
                        if (tenantRecord.applications[i].keys[j].key === inputmaskData.key) {
                            position.push(j); //application key position found

                            //if extKey is requested, go one level deeper
                            if (inputmaskData.extKey && inputmaskData.extKeyEnv) {
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
        return {'found': found, 'position': position};
    },

    "list": (soajs, inputmaskData, cb) => {
        let l_modelObj = bl.mp.getModel(soajs);

        l_modelObj.listTenants(null, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);

            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            return cb(null, records);
        });
    },

    "listConsole": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        if (inputmaskData.type) {
            data.type = inputmaskData.data;
            if (Object.hasOwnProperty.call(inputmaskData, "negate")) {
                data.negate = inputmaskData.negate;
            }
        }

        l_modelObj.listConsoleTenants(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err || !record) {
                return cb(bl.handleError(soajs, 436, err));
            }
            if (record.oauth && record.oauth.secret && record.oauth.secret !== '') {
                record.oauth.authorization = Auth.generate(record._id, record.oauth.secret);
            } else {
                record.oauth.authorization = "No Authorization Enabled, update tenant and set an 'oAuth Secret' to enable token generation.";
            }
            return cb(null, record);
        });
    },

    // "add": function (soajs, inputmaskData, localConfig, cb) {
    //     //TODO: Generate code if not input by user by checking the existed codes of all tenants up to a 25 times count request.
    //     // if exist don't add
    //     // if not check on the insert if the generated code is also generated by another request so you got no dupliacate
    //     // the count request limit must not exceed 25 times.
    //
    //      let l_modelObj = bl.mp.getModel(soajs);
    //
    //     if (!inputmaskData) {
    //         return cb(bl.handleError(soajs, 473, null));
    //     }
    //
    //     let data;
    //
    //     data = {
    //         code: inputmaskData.code.toUpperCase(),
    //         type: inputmaskData.type,
    //         name: inputmaskData.name,
    //         description: inputmaskData.description,
    //         oauth: {
    //             "secret": 'this is a secret',
    //             "redirectURI": 'http://domain.com',
    //             "grants": ["password", "refresh_token"],
    //             "disabled": 0,
    //             "type": 2,
    //             "loginMode": "urac"
    //         },
    //         applications: []
    //     };
    //     if (inputmaskData.console) {
    //         data.oauth.disabled = 1;
    //         data.oauth.loginMode = "oauth";
    //     }
    //     if (inputmaskData.profile) {
    //         data.profile = inputmaskData.profile;
    //     }
    //     if (inputmaskData.tag){
    //         data.tag = inputmaskData.tag;
    //     }
    //
    //     if (inputmaskData.type === "product") {
    //         return cb(null, true);
    //     } else {
    //
    //     }
    //
    // },

    "update": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);

        let data = {
            id: inputmaskData.id,
            description: inputmaskData.description,
            name: inputmaskData.name,
            type: inputmaskData.type
        };

        if (inputmaskData.profile) {
            data.profile = inputmaskData.profile;
        }
        if (inputmaskData.tag) {
            data.tag = inputmaskData.tag;
        }

        bl.checkCanEdit(l_modelObj, data, (err, result) => {
            l_modelObj.updateTenant(data, (err, record) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 421, err));
                }
                return cb(null, record);
            });
        });
    },

    "get": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 474, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);

        let data = {};

        if (inputmaskData.id) {
            data.id = inputmaskData.id;
        } else {
            data.code = inputmaskData.code;
        }

        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            if (record && record.oauth && record.oauth.secret && record.oauth.secret !== '') {
                record.oauth.authorization = "Basic " + new Buffer(record._id.toString() + ":" + record.oauth.secret).toString('base64');
            }
            return cb(null, record);
        });
    },

    "deleteOAuth": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);

        let data = {};
        data.id = inputmaskData.id;
        data.oauth = {};

        bl.checkCanEdit(l_modelObj, data, (err, result) => {
            l_modelObj.updateTenant(data, (err, record) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 421, err));
                }
                return cb(null, record);
            });
        });
    },

    "getOAuth": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }

            return cb(null, record.oauth);
        });
    },

    /*"getOAuthUsers": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }

            return cb(null, record.oauth); // TODO: GET USERS NOT OAUTH OBJECT FROM OAUTH URAC
        });
    }, //TODO: TESTS and URAC OAUTH */

    "listApplications": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            return cb(null, record.application);
        });
    },

    "getApplicationKeys": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            let keys = [];
            record.applications.forEach(app => {
                if (app.appId.toString() === inputmaskData.appId) {
                    keys = app.keys;
                }
            });
            return cb(null, keys);
        });
    },

    "deleteApplicationKey": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        // if (inputmaskData.key === soajs.tenant.key.iKey) {
        //     return cb(bl.handleError(soajs, 464, null));
        // } //TODO: Check if still tenant key

        let l_modelObj = bl.mp.getModel(soajs);

        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 436, err));
            }
            l_modelObj.updateTenant(data, (err, result) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 421, err));
                }
                let x = bl.getRequestedSubElementsPositions(inputmaskData, record);
                record.applications[x.position[0]].keys.splice(x.position[1], 1);
                return cb(null, result);
            });
        });
    },

    "listApplicationExtKeys": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id
        };

        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            let x = bl.getRequestedSubElementsPositions(inputmaskData, record);
            if (x.found) {
                let extKeys = record.applications[x.position[0]].keys[x.position[1]].extKeys;
                return cb(null, extKeys);
            } else {
                return cb(null, []);
            }
        });
    },

    "listApplicationConfig": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            id: inputmaskData.id,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            let x = bl.getRequestedSubElementsPositions(inputmaskData, record);
            if (x.found) {
                return cb(null, record.applications[x.position[0]].keys[x.position[1]].config);
            } else {
                return cb(null, {});
            }
        });
    },

    "listDashboardKeys": (soajs, inputmaskData, cb) => {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {
            code: inputmaskData.code,
        };
        l_modelObj.getTenant(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 436, err));
            }
            let keys = [];
            record.applications.forEach(app => {
                app.keys.forEach(key => {
                    key.extKeys.forEach(extKey => {
                        if (extKey.dashboardAccess) {
                            keys.push(extKey.extKey);
                        }
                    });
                });
            });
            return cb(null, keys);
        });
    },
};

module.exports = bl;