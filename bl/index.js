'use strict';

const fs = require("fs");
const defaultModel = "mongo";

let SSOT = {};
let model = process.env.SOAJS_SERVICE_MODEL || null;

function init(service, localConfig, cb) {

    model = model || defaultModel;

    let productModel = __dirname + "/../model/" + model + "/product.js";
    if (fs.existsSync(productModel)) {
        let product = require(productModel);
        SSOT.productModelObj = new product(service, null);
    }

    if (SSOT.productModelObj) {

        let product = require("./product.js");
        product.modelObj = SSOT.productModelObj;
        BL.product = product;

        return cb(null);
    }
    else {
        service.log.error('Requested model not found. make sure you have a model for product @ ' + productModel);
        return cb({"code": 601, "msg": localConfig.errors[601]});
    }
}

let BL = {
    init: init,
    product: null
};

module.exports = BL;