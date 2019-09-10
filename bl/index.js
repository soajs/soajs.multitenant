'use strict';

const async = require("async");
const fs = require("fs");

let SSOT = {};
let model = process.env.SOAJS_SERVICE_MODEL || "mongo";
const BLs = ["product"];

function init(service, localConfig, cb) {
    let fillModels = (blName, cb) => {
        let typeModel = __dirname + `/../model/${model}/${blName}.js`;

        if (fs.existsSync(typeModel)) {
            SSOT[`${blName}Model`] = require(typeModel);
            SSOT[`${blName}ModelObj`] = new SSOT[`${blName}Model`](service, null, null);
        }
        if (SSOT[`${blName}ModelObj`]) {
            let temp = require(`./${blName}.js`);
            temp.modelObj = SSOT[`${blName}ModelObj`];
            temp.model = SSOT[`${blName}Model`];
            temp.soajs_service = service;
            temp.localConfig = localConfig;
            BL[blName] = temp;
            return cb(null);
        } else {
            return cb({name: blName, model: typeModel});
        }
    };
    async.each(BLs, fillModels, function (err) {
        if (err) {
            service.log.error(`Requested model not found. make sure you have a model for ${err.name} @ ${err.model}`);
            return cb({"code": 601, "msg": localConfig.errors[601]});
        }
        return cb(null);
    });
}

let BL = {
    init: init,
    product: null

};

module.exports = BL;