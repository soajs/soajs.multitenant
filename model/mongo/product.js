"use strict";
const colName = "products";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Product(service, options, mongoCore) {
    let __self = this;

    if (mongoCore) {
        __self.mongoCore = mongoCore;
    }
    if (!__self.mongoCore) {
        if (options && options.dbConfig) {
            __self.mongoCore = new Mongo(options.dbConfig);
        } else {
            let registry = service.registry.get();
            __self.mongoCore = new Mongo(registry.coreDB.provision);
        }
    }
    let index = "default";
    if (options && options.index) {
        index = options.index;
    }
    if (indexing && !indexing[index]) {
        indexing[index] = true;
        __self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, (err, result) => {
        });
        __self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, (err, result) => {
        });

        service.log.debug("Product: Indexes for " + index + " Updated!");
    }
}

Product.prototype.listProducts = function (data, cb) {
    let __self = this;
    
    let condition = {
        $or: [
            {console: false},
            {console: null}
        ]
    };

    __self.mongoCore.find(colName, condition, null, null, (err, records) => {
        return cb(err, records);
    });
};

Product.prototype.listConsoleProducts = function (data, cb) {
    let __self = this;

    let condition = {
        console: true
    };
    __self.mongoCore.find(colName, condition, null, null, (err, records) => {
        return cb(err, records);
    });
};

Product.prototype.saveProduct = function (data, cb) {
    let __self = this;
    if (!data || !data._id) {
        let error = new Error("_id is required.");
        return cb(error, null);
    }
    __self.mongoCore.save(colName, data, (err, result) => {
        return cb(err, result);
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
    if (!data || !(data.id || data.code)) {
        let error = new Error("id or code is required.");
        return cb(error, null);
    }

    let condition = {};
    if (data.id) {
        __self.validateId(data.id, (err, id) => {
            if (err) {
                return cb(err, null);
            }
            condition = {'_id': id};

            __self.mongoCore.findOne(colName, condition, null, null, (err, record) => {
                return cb(err, record);
            });
        });
    } else {
        if (data.code) {
            condition = {'code': data.code}; // TODO: ADD to documentation
        }

        __self.mongoCore.findOne(colName, condition, null, null, (err, record) => {
            return cb(err, record);
        });
    }
};

Product.prototype.checkIfExist = function (data, cb) {
    let __self = this;

    if (!data || !(data.code || data.id)) {
        let error = new Error("code or id is required.");
        return cb(error, null);
    }

    let condition = {};

    if (data.id) {
        __self.validateId(data.id, (err, id) => {
            if (err) {
                return cb(err, null);
            }
            condition = {'_id': id};
            __self.mongoCore.count(colName, condition, (err, count) => {
                return cb(err, count);
            });
        });
    } else {
        if (data.code) {
            condition.code = data.code;
        }
        __self.mongoCore.count(colName, condition, (err, count) => {
            return cb(err, count);
        });
    }
};

Product.prototype.addProduct = function (data, cb) {
    let __self = this;

    if (!data || !data.code || !data.name) {
        let error = new Error("name and code are required.");
        return cb(error, null);
    }

    __self.mongoCore.insert(colName, data, (err, record) => {
        if (record && Array.isArray(record))
            record = record [0];
        return cb(err, record);
    });
};

Product.prototype.deleteProduct = function (data, cb) {
    let __self = this;
    if (!data || !(data.id || data.code)) {
        let error = new Error("id or code are required.");
        return cb(error, null);
    }

    let condition = {};
    if (data.id) {
        __self.validateId(data.id, (err, id) => {
            if (err) {
                return cb(err, null);
            }
            condition = {'_id': id};
            __self.mongoCore.remove(colName, condition, (err, count) => {
                return cb(err, count);
            });
        });
    } else {
        if (data.code) {
            condition.code = data.code;
        }
        __self.mongoCore.remove(colName, condition, (err, count) => {
            return cb(err, count);
        });
    }
};

Product.prototype.validateId = function (id, cb) {
    let __self = this;

    if (!id) {
        let error = new Error("id is required.");
        return cb(error, null);
    }

    try {
        id = __self.mongoCore.ObjectId(id);
        return cb(null, id);
    } catch (e) {
        return cb(e, null);
    }
};

Product.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Product;