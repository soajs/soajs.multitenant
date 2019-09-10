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
        //todo fix indexes
        __self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, (err, result) => {
        });

        __self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, (err, result) => {
        });

        // __self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, function (err, result) {
        // });
        // __self.mongoCore.createIndex(colName, {'packages.code': 1}, {}, function (err, result) {
        // });
        // __self.mongoCore.createIndex(colName, {'code': 1, 'packages.code': 1}, {}, function (err, result) {
        // });

        service.log.debug("Product: Indexes for " + index + " Updated!");
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
Product.prototype.validateId = function (id, cb) {
    let __self = this;

    if (!id) {
        let error = new Error("must provide id.");
        return cb(error, null);
    }

    try {
        id = __self.mongoCore.ObjectId(id);
        return cb(null, id);
    } catch (e) {
        return cb(e, null);
    }
};

Product.prototype.listProducts = function (data, cb) {
    let __self = this;

    //todo Check remove console products
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
        let error = new Error("must provide either id or code.");
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
        let error = new Error("must provide either code or id.");
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

    if (!data || !(data.code || data.name)) {
        let error = new Error("must provide name and code.");
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
        let error = new Error("must provide either id or code.");
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
//
// /**
//  * To edit a product
//  *
//  * @param data
//  *  should have:
//  *      required (id)
//  *
//  * @param cb
//  */
// Product.prototype.updateProduct = function (data, cb) {
//     let __self = this;
//     if (!data || !data.id) {
//         let error = new Error("id is required.");
//         return cb(error, null);
//     }
//
//     let condition = {'_id': data.id};
//
//     let options = {'upsert': false, 'safe': true};
//
//     __self.mongoCore.update(colName, condition, data, options, (err, result) => {
//         return cb(err, result);
//     });
// };
//
// // Product.prototype.listEnvironments = function (data, cb) {
// //     let __self = this;
// //     let condition = {};
// //
// //     let params = {"code": 1};
// //
// //     if (!data.console) {
// //         condition = {
// //             code: {$ne: process.env.SOAJS_ENV.toUpperCase()}
// //         };
// //     }
// //     __self.mongoCore.find(envColName, condition, params, null, (err, record) => {
// //         return cb(err, record);
// //     });
// // };
//
// // Product.prototype.sanitize = function (cb) {
// //     let __self = this;
// //     async.eachOf(__self.soajs.inputmaskData.scope, function (env, envKey, call) {
// //         async.eachOf(env, function (service, serviceKey, callback) {
// //             let sanitizedVersion = {};
// //             Object.keys(service).forEach(function (key) {
// //                 sanitizedVersion[soajsLib.version.sanitize(key)] = service[key];
// //                 delete service[key];
// //             });
// //             __self.soajs.inputmaskData.scope[envKey][serviceKey] = sanitizedVersion;
// //             callback();
// //         }, call);
// //     }, cb);
// // };
// //
// // Product.prototype.unsanitize = function (record, cb) {
// //     if (record && record.scope && record.scope.acl && Object.keys(record.scope.acl > 0)) {
// //         let scope = record.scope.acl;
// //         unsanitize(scope, () => {
// //             record.scope.acl = scope;
// //             return cb(null, record);
// //         });
// //     } else {
// //         return cb(null, record);
// //     }
// //
// //     function unsanitize(acl, cb) {
// //         async.eachOf(acl, function (env, envKey, call) {
// //             async.eachOf(env, function (service, serviceKey, callback) {
// //                 let sanitizedVersion = {};
// //                 Object.keys(service).forEach(function (key) {
// //                     sanitizedVersion[soajsLib.version.unsanitize(key)] = service[key];
// //                     delete service[key];
// //                 });
// //                 acl[envKey][serviceKey] = sanitizedVersion;
// //                 callback();
// //             }, call);
// //         }, cb);
// //     }
// // };

Product.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Product;