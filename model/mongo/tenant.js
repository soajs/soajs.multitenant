"use strict";
const colName = "tenants";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Tenant(service, options, mongoCore) {
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

        service.log.debug("Tenant: Indexes for " + index + " Updated!");
    }
}

Tenant.prototype.validateId = function (id, cb) {
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

Tenant.prototype.getTenant = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || data.code)) {
		let error = new Error("id or code is required.");
		return cb(error, null);
	}
	
	let condition = {
		'$and' : [{
			"$or": [
				{console: false},
				{console: null}
			]
		}]
	};
	if (data.id) {
		__self.validateId(data.id, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition["$and"].push({'_id': id});
			
			__self.mongoCore.findOne(colName, condition, null, null, cb);
		});
	} else {
		if (data.code) {
			condition["$and"].push({'code': data.code}); // TODO: ADD to documentation
		}
		
		__self.mongoCore.findOne(colName, condition, null, null, cb);
	}
};

Tenant.prototype.ListTenants = function (data, cb) {
	let __self = this;
	
	let condition = {
		'$and' : [{
			"$or": [
				{console: false},
				{console: null}
			]
		}]
	};
	
	if (data.type){
		condition["$and"].push({'type': data.type});
	}
	__self.mongoCore.find(colName, condition, null, null, cb);
};

Tenant.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Tenant;