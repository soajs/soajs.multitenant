'use strict';

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
            "msg": bl.localConfig.errors[errCode]
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

    "list": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        l_modelObj.listProducts(localConfig.console, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err));
            }
            return cb(null, records);
        });
    },

    "listConsole": function (soajs, inputmaskData, localConfig, cb) {
        let l_modelObj = bl.modelObj;
        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
            l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
        }
        l_modelObj.listConsoleProducts(localConfig.console, (err, records) => {
            if (err) {
                soajs.log.error(err);
                if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                    l_modelObj.closeConnection();
                }
                return cb({
                    "code": 460,
                    "msg": localConfig.errors[460]
                });
            }
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj.closeConnection();
            }
            return cb(null, records);
        });
    },

    "get": function (soajs, inputmaskData, localConfig, cb) {
        let l_modelObj = bl.modelObj;

        if (!inputmaskData || !(inputmaskData.code || inputmaskData.id)) {
            return cb({
                "code": 474,
                "msg": localConfig.errors[474]
            });
        }

        let data = {};
        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
            l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
        }

        let getProduct = (data) => {
            l_modelObj.getProduct(data, (err, record) => {
                if (err) {
                    soajs.log.error(err);
                    if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                        l_modelObj.closeConnection();
                    }
                    return cb({
                        "code": 460,
                        "msg": localConfig.errors[460]
                    });
                }
                if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                    l_modelObj.closeConnection();
                }
                return cb(null, record);
            });
        };

        if (inputmaskData.id) {
            l_modelObj.validateId(inputmaskData, (err, id) => {
                if (err) {
                    soajs.log.error(err);
                    if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                        l_modelObj.closeConnection();
                    }
                    return cb({
                        "code": 426,
                        "msg": localConfig.errors[426]
                    });
                }
                data.id = id;
                getProduct(data);
            });
        } else if (inputmaskData.code) {
            data.code = inputmaskData.code;
            getProduct(data);
        }
    },

    "add": function (soajs, inputmaskData, localConfig, cb) {
        let l_modelObj = bl.modelObj;
        let data = {
            name: inputmaskData.name,
            code: inputmaskData.code,
            description: inputmaskData.description,
            scope: {
                acl: {}
            },
            packages: []
        };

        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
            l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
        }

        l_modelObj.checkIfExist(data, (err, count) => {
            if (err) {
                soajs.log.error(err);
                if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                    l_modelObj.closeConnection();
                }
                return cb({
                    "code": 474,
                    "msg": localConfig.errors[474]
                });
            }
            if (count > 0) {
                if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                    l_modelObj.closeConnection();
                }
                return cb({
                    "code": 468,
                    "msg": localConfig.errors[468]
                });
            } else {
                l_modelObj.addProduct(data, (err, record) => {
                    if (err) {
                        soajs.log.error(err);
                        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                            l_modelObj.closeConnection();
                        }
                        return cb({
                            "code": 469,
                            "msg": localConfig.errors[469]
                        });
                    }
                    return cb(null, record);
                });
            }
        });
    },

};

module.exports = bl;