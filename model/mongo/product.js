"use strict";
const colName = "products";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = false;

function Product(service, dbConfig, mongoCore) {
    let __self = this;
    let indexingFn = () => {
        if (!indexing) {
            indexing = true;
            //todo fix indexes
            __self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, function (err, result) {
            });
            __self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, function (err, result) {
            });
            __self.mongoCore.createIndex(colName, {'packages.code': 1}, {}, function (err, result) {
            });
            __self.mongoCore.createIndex(colName, {'code': 1, 'packages.code': 1}, {}, function (err, result) {
            });
            __self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, function (err, result) {
            });

            service.log.debug("Indexes for " + colName + " Updated!");
        }
    };
    if (mongoCore) {
        __self.mongoCore = mongoCore;
        indexingFn();
    }
    if (!__self.mongoCore) {
        if (dbConfig) {
            __self.mongoCore = new Mongo(dbConfig);
        } else {
            let registry = service.registry.get();
            __self.mongoCore = new Mongo(registry.coreDB.provision);
        }
        indexingFn();
    }
}

/**
 * To validate and convert an id to mongodb objectID
 *
 * @param data
 *  should have:
 *      required (id)
 *
 * @param cb
 */
Product.prototype.validateId = function (data, cb) {
    let __self = this;

    if (!data || !data.id) {
        let error = new Error("must provide id.");
        return cb(error, null);
    }

    try {
        data.id = __self.mongoCore.ObjectId(data.id);
        return cb(null, data.id);
    } catch (e) {
        return cb(e, null);
    }
};

Product.prototype.listProducts = function (data, cb) {
    let __self = this;
    //todo Check remove console products
    let condition = {
        code: {
            $ne: data.product
        }
    };
    __self.mongoCore.find(colName, condition, null, null, (err, records) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, records);
    });
};

Product.prototype.listConsoleProducts = function (data, cb) {
    let __self = this;
    let condition = {
        code: data.product
    };
    __self.mongoCore.find(colName, condition, null, null, (err, records) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, records);
    });
};

/**
 * To get a product
 *
 * @param data
 *  should have:
 *      required (id)
 *
 * @param cb
 */
Product.prototype.getProduct = function (data, cb) {
    let __self = this;
    let condition = {};

    if (data.id) {
        condition = {'_id': data.id};
    } else if (data.code) {
        condition = {'code': data.code};
    }

    __self.mongoCore.findOne(colName, condition, null, null, (err, record) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, record);
    });
};


Product.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Product;