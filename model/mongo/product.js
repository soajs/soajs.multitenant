"use strict";
const colName = "products";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = false;

function Product(service, mongoCore) {
    let __self = this;
    let indexingFn = () => {
        if (!indexing) {
            indexing = true;
			//todo fix indexes
            __self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, function (err, result) {
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
        let registry = service.registry.get();
        __self.mongoCore = new Mongo(registry.coreDB.provision);
        indexingFn();
    }
}

Product.prototype.listProducts = function (data, cb) {
    let __self = this;
	//todo add remove console products
    __self.mongoCore.find(colName, null, null, null, (err, records) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, records);
    });
};

Product.prototype.closeConnection = function () {
    let __self = this;

    __self.mongoCore.closeDb();
};

module.exports = Product;