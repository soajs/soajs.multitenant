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
        "closeModel": (soajs, l_modelObj) => {
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj.closeConnection();
            }
        }
    },


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

        modelObj.checkIfExist(data, (err, count) => {
            if (err) {
                bl.mp.closeModel(soajs, modelObj);
                return cb(bl.handleError(soajs, 602, err));
            }

            if (count > 0) {
                bl.mp.closeModel(soajs, modelObj);
                return cb(bl.handleError(soajs, 468, err));
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
            modelObj.deleteProduct(data, (err, result) => {
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