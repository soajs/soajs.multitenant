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
			if (!record) {
				return cb(bl.handleError(soajs, 450, err), null);
			}
			return cb(null, record);
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