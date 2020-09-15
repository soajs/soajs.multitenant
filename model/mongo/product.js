
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "products";
const core = require("soajs");
const lib = require("../../lib/sanitize.js");
const async = require("async");
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
	
	    let index = "default";
	    if (options && options.index) {
		    index = options.index;
	    }
	    if (indexing && !indexing[index]) {
		    indexing[index] = true;
		    __self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, () => {
		    });
		
		    __self.mongoCore.createIndex(colName, {'packages.code': 1}, {}, () => {
		    });
		
		    __self.mongoCore.createIndex(colName, {'code': 1, 'packages.code': 1}, {}, () => {
		    });
		
		    service.log.debug("Product: Indexes for " + index + " Updated!");
	    }
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

    __self.mongoCore.find(colName, condition, null, (err, records) => {
	    async.map(records, function (record, callback) {
		    lib.unsanitize(record, callback);
	    }, cb);
    });
};

Product.prototype.listConsoleProducts = function (data, cb) {
    let __self = this;

    let condition = {
	    $or: [
		    {console: true},
		    {code: "DBTN"},
	    ]
    };
    __self.mongoCore.find(colName, condition, null, (err, records) => {
	    async.map(records, function (record, callback) {
		    lib.unsanitize(record, callback);
	    }, cb);
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

Product.prototype.getProduct = function (data, cb) {
    let __self = this;
    if (!data || !(data.id || data.code)) {
        let error = new Error("id or code is required.");
        return cb(error, null);
    }
	let partial = [{
		console: !!data.soajs
	}];
	if (!data.soajs){
		partial.push({console: null});
	}
	
	let condition = {
		'$and' : [{
			"$or": partial
		}]
	};
    if (data.id) {
        __self.validateId(data.id, (err, id) => {
            if (err) {
                return cb(err, null);
            }
            condition.$and.push({'_id': id});

            __self.mongoCore.findOne(colName, condition, null, (err, record) => {
	            lib.unsanitize(record, cb);
            });
        });
    } else {
        if (data.code) {
	        condition.$and.push({'code': data.code}); // TODO: ADD to documentation
        }

        __self.mongoCore.findOne(colName, condition, null, (err, record) => {
	        lib.unsanitize(record, cb);
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
	if (data.scope && data.scope.acl) {
		let scope = data.scope.acl;
		lib.sanitize(scope, () => {
			data.scope.acl = scope;
			__self.mongoCore.insert(colName, data, (err, record) => {
				if (record && Array.isArray(record)){
					record = record[0];
				}
				return cb(err, record);
			});
		});
	} else {
		__self.mongoCore.insert(colName, data, (err, record) => {
			if (record && Array.isArray(record)){
				record = record [0];
			}
			return cb(err, record);
		});
	}
};

Product.prototype.deleteProduct = function (data, cb) {
    let __self = this;
    if (!data || !(data.code || data._id)) {
        let error = new Error("_id or code are required.");
        return cb(error, null);
    }

    let condition = {};
	
	if (data._id) {
		condition._id = data._id;
	} else {
		condition.code = data.code;
	}
	__self.mongoCore.remove(colName, condition, (err, count) => {
		return cb(err, count);
	});
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

Product.prototype.updateProduct = function (data, cb) {
	let __self = this;
	if (!data || !data._id) {
		let error = new Error("_id is required.");
		return cb(error, null);
	}
	
	let condition = {'_id': data._id};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {
		}
	};
	if (data.description){
		fields.$set.description = data.description;
	}
	
	if (data.name){
		fields.$set.name = data.name;
	}
	
	if (data.packages){
		fields.$set.packages = data.packages;
	}
	if (data.scope){
		let scope = data.scope.acl;
		lib.sanitize(scope, () => {
			fields.$set.scope = scope;
			__self.mongoCore.update(colName, condition, fields, options, (err, result) => {
				return cb(err, result);
			});
		});
	}
	else {
        if (Object.keys(fields.$set).length === 0){
			//nothing to update
			return cb(null, 0);
		}
        __self.mongoCore.update(colName, condition, fields, options, (err, result) => {
			return cb(err, result);
		});
	}
	
};

Product.prototype.updateScope = function (data, cb) {
	let __self = this;
	if (!data || !data._id || !data.env || !data.acl ) {
		let error = new Error("_id, env, and acl are required.");
		return cb(error, null);
	}
	
	let condition = {'_id': data._id};
	let options = {'upsert': false, 'safe': true};
	
	let scope = {
		[data.env]: data.acl
	};
	lib.sanitize(scope, () => {
		let fields = {
			'$set': {
				["scope.acl." + data.env]: scope[data.env]
			}
		};
		__self.mongoCore.update(colName, condition, fields, options, (err, result) => {
			return cb(err, result);
		});
	});
};

Product.prototype.updatePackageACL = function (data, cb) {
	let __self = this;
	if (!data || !data.code || !data.packageCode || !data.acl ) {
		let error = new Error("_id, env, and acl are required.");
		return cb(error, null);
	}
	
	let condition = {
		'code': data.code,
		'packages.code': data.packageCode
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {
			'packages.$.acl': data.acl
		}
	};
	
	__self.mongoCore.update(colName, condition, fields, options, (err, result) => {
		return cb(err, result);
	});
	
};

Product.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Product;