"use strict";
const colName = "products";
const core = require("soajs");
const Mongo = core.mongo;
const async = require("async");
const soajsLib = require("soajs.core.libs");

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

    if (!data || !data.product) {
        let error = new Error("Missing Fields: product");
        return cb(error, null);
    }

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

    if (!data || !data.product) {
        let error = new Error("Missing Fields: product");
        return cb(error, null);
    }

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

    if (!data || !(data.id || data.code)) {
        let error = new Error("must provide either id or code.");
        return cb(error, null);
    }

    if (data.id) {
        try {
            data.id = __self.mongoCore.ObjectId(data.id);
        } catch (e) {
            return cb(e, null);
        }
        condition = {'_id': data.id};
    } else if (data.code) {
        condition = {'code': data.code}; // TODO: ADD to documentation
    }

    __self.mongoCore.findOne(colName, condition, null, null, (err, record) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, record);
    });
};

Product.prototype.checkIfExist = function (data, cb) {
    let __self = this;

    if (!data || !(data.code || data.id)) {
        let error = new Error("must provide either code or id.");
        return cb(error, null);
    }

    let condition = {};

    if (data.code) {
        condition.code = data.code;
    } else if (data.id) {
        condition.id = data.id;
    }


    __self.mongoCore.count(colName, condition, (err, count) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, count);
    });
};

Product.prototype.addProduct = function (data, cb) {
    let __self = this;

    __self.mongoCore.insert(colName, data, (err, result) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, result);
    });
};

Product.prototype.deleteProduct = function (data, cb) {
    let __self = this;
    if (!data || !(data.id || data.code)) {
        let error = new Error("must provide either id or code.");
        return cb(error, null);
    }

    let condition = {};

    if (data.code) {
        condition.code = data.code;
    } else if (data.id) {
        condition.id = data.id;
    }

    __self.mongoCore.remove(colName, condition, (err, result) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, result);
    });
};

/**
 * To edit a product
 *
 * @param data
 *  should have:
 *      required (id)
 *
 * @param cb
 */
Product.prototype.updateProduct = function (data, cb) {
    let __self = this;
    if (!data || !data.id) {
        let error = new Error("id is required.");
        return cb(error, null);
    }

    let condition = {'_id': data.id};

    let options = {'upsert': false, 'safe': true};

    __self.mongoCore.update(colName, condition, data, options, (err, result) => {

        if (err) {
            return cb(err, null);
        }
        return cb(null, result);
    });
};

// Product.prototype.sanitize = function (cb) {
//     let __self = this;
//     async.eachOf(__self.soajs.inputmaskData.scope, function (env, envKey, call) {
//         async.eachOf(env, function (service, serviceKey, callback) {
//             let sanitizedVersion = {};
//             Object.keys(service).forEach(function (key) {
//                 sanitizedVersion[soajsLib.version.sanitize(key)] = service[key];
//                 delete service[key];
//             });
//             __self.soajs.inputmaskData.scope[envKey][serviceKey] = sanitizedVersion;
//             callback();
//         }, call);
//     }, cb);
// };
//
// Product.prototype.unsanitize = function (record, cb) {
//     if (record && record.scope && record.scope.acl && Object.keys(record.scope.acl > 0)) {
//         let scope = record.scope.acl;
//         unsanitize(scope, () => {
//             record.scope.acl = scope;
//             return cb(null, record);
//         });
//     } else {
//         return cb(null, record);
//     }
//
//     function unsanitize(acl, cb) {
//         async.eachOf(acl, function (env, envKey, call) {
//             async.eachOf(env, function (service, serviceKey, callback) {
//                 let sanitizedVersion = {};
//                 Object.keys(service).forEach(function (key) {
//                     sanitizedVersion[soajsLib.version.unsanitize(key)] = service[key];
//                     delete service[key];
//                 });
//                 acl[envKey][serviceKey] = sanitizedVersion;
//                 callback();
//             }, call);
//         }, cb);
//     }
// };

Product.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Product;