'use strict';


let bl = {
    "modelObj": null,
    "model": null,
    "list": function (soajs, inputmaskData, localConfig, cb) {
        bl.modelObj.listProducts(null, (err, records) => {
            if (err) {
                soajs.log.error(err);
                return cb({
                    "code": 460,
                    "msg": localConfig.errors[460]
                });
            }
            return cb(null, records);
        });
    }
};

module.exports = bl;