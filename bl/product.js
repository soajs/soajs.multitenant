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
        l_modelObj.listProducts(localConfig, (err, records) => {
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
        l_modelObj.listConsoleProducts(localConfig, (err, records) => {
           if (err) {
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
    }
};

module.exports = bl;