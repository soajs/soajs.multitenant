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
        SSOT.productModel = require(productModel);
        SSOT.productModelObj = new SSOT.productModel(service, null);
    }

    let tenantModel = __dirname + "/../model/" + model + "/tenant.js";
    if (fs.existsSync(tenantModel)) {
        SSOT.tenantModel = require(tenantModel);
        SSOT.tenantModelObj = new SSOT.tenantModel(service, SSOT.productModelObj);
    }

    if (SSOT.productModelObj && SSOT.tenantModelObj) {

        let product = require("./product.js");
        product.modelObj = SSOT.productModelObj;
        product.model = SSOT.productModel;
        BL.product = product;


        let tenant = require("./tenant.js");
        product.modelObj = SSOT.tenantModelObj;
        product.model = SSOT.tenantModel;
        BL.tenant = tenant;

        return cb(null);
    }
    else {
        service.log.error('Requested model not found. make sure you have a model for product @ ' + productModel);
        return cb({"code": 601, "msg": localConfig.errors[601]});
    }
}

let BL = {
    init: init,
    product: null,
    tenant: null
};

module.exports = BL;