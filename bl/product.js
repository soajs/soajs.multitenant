'use strict';


let bl = {
    "modelObj": null,
    "model": null,
    "soajs_service": null,
    "list": function (soajs, inputmaskData, localConfig, cb) {
        let l_modelObj = bl.modelObj;
        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
            l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
        }
        l_modelObj.listProducts(localConfig.console, (err, records) => {
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
                        "msg": soajs.config.errors[426]
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

};

module.exports = bl;