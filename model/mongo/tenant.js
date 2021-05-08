/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
		
		let index = "default";
		if (options && options.index) {
			index = options.index;
		}
		if (indexing && !indexing[index]) {
			indexing[index] = true;
			__self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, () => {
			});
			__self.mongoCore.createIndex(colName, {'_id': 1, 'locked': 1}, {}, () => {
			});
			__self.mongoCore.createIndex(colName, {'name': 1}, {}, () => {
			});
			__self.mongoCore.createIndex(colName, {'type': 1}, {}, () => {
			});
			
			__self.mongoCore.createIndex(colName, {'console': 1, 'type': 1, 'tenant.code': 1, 'name': 1, 'code': 1}, {
				partialFilterExpression: {
					"tenant.code": {
						"$exists": true
					}
				}
			}, () => {
			});
			
			__self.mongoCore.createIndex(colName, {'console': 1, 'type': 1, 'name': 1, 'code': 1}, {}, () => {
			});
			__self.mongoCore.createIndex(colName, {'_id': 1, 'console': 1}, {}, () => {
			});
			__self.mongoCore.createIndex(colName, {'applications.keys.extKeys.env': 1}, {}, () => {
			});
			__self.mongoCore.createIndex(colName, {'applications.keys.key': 1}, {}, () => {
			});
			
			service.log.debug("Tenant: Indexes for " + index + " Updated!");
		}
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

Tenant.prototype.getTenants = function (data, cb) {
	let __self = this;
	if (!data || !data.codes || !Array.isArray(data.codes) || data.codes.length <= 0) {
		let error = new Error("Array of codes is required.");
		return cb(error, null);
	}
	
	let partial = [
		{
			console: !!data.soajs
		}
	];
	if (!data.soajs) {
		partial.push({console: null});
	}
	let condition = {
		'$and': [{
			"$or": partial
		}]
	};
	
	condition.$and.push({'code': {'$in': data.codes}});
	
	__self.mongoCore.find(colName, condition, null, cb);
};

Tenant.prototype.getTenant = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || data.code)) {
		let error = new Error("id or code is required.");
		return cb(error, null);
	}
	
	let partial = [
		{
			console: !!data.soajs
		}
	];
	if (!data.soajs) {
		partial.push({console: null});
	}
	let condition = {
		'$and': [{
			"$or": partial
		}]
	};
	
	if (data.id) {
		__self.validateId(data.id, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition.$and.push({'_id': id});
			__self.mongoCore.findOne(colName, condition, null, cb);
		});
	} else {
		if (data.code) {
			condition.$and.push({'code': data.code});
		}
		
		__self.mongoCore.findOne(colName, condition, null, cb);
	}
};

Tenant.prototype.listTenantSubTenants = function (data, cb) {
	let __self = this;
	if (!data || !data.code) {
		let error = new Error("code is required.");
		return cb(error, null);
	}
	let condition = {
		"$or": [
			{console: false},
			{console: null}
		]
	};
	let andCond = [];
	andCond.push({'type': "client"});
	andCond.push({'tenant.code': data.code});
	
	if (data.keywords) {
		let rePattern = new RegExp(data.keywords, 'i');
		andCond.push({"$or": [{"name": {"$regex": rePattern}}, {"code": {"$regex": rePattern}}]});
	}
	if (andCond.length > 0) {
		condition.$and = andCond;
	}
	let options = {
		"skip": 0,
		"limit": 50,
		"sort": {"name": 1}
	};
	if (data && data.limit) {
		options.limit = data.limit;
	}
	if (data && data.start) {
		options.skip = data.start;
	}
	__self.mongoCore.find(colName, condition, options, (error, response) => {
		if (error) {
			return cb(error);
		} else {
			let current_count = options.skip;
			if (response && response.length) {
				current_count = current_count + response.length;
			}
			if (current_count < options.limit) {
				return cb(null, {
					"limit": options.limit,
					"start": options.skip,
					"count": response.length,
					"items": response
				});
			} else {
				__self.count(data, condition, (error, count) => {
					if (error) {
						return cb(error);
					} else {
						return cb(null, {
							"limit": options.limit,
							"start": options.skip,
							"count": count,
							"items": response
						});
					}
				});
			}
		}
	});
};

Tenant.prototype.listTenants = function (data, cb) {
	let __self = this;
	
	let condition = {
		"$or": [
			{console: false},
			{console: null}
		]
	};
	let andCond = [];
	if (data && data.type) {
		andCond.push({'type': data.type});
	}
	if (data.keywords) {
		let rePattern = new RegExp(data.keywords, 'i');
		andCond.push({"$or": [{"name": {"$regex": rePattern}}, {"code": {"$regex": rePattern}}]});
	}
	if (andCond.length > 0) {
		condition.$and = andCond;
	}
	let options = {
		"skip": 0,
		"limit": 500,
		"sort": {"name": 1}
	};
	if (data && data.limit) {
		options.limit = data.limit;
	}
	if (data && data.start) {
		options.skip = data.start;
	}
	__self.mongoCore.find(colName, condition, options, (error, response) => {
		if (error) {
			return cb(error);
		} else {
			let current_count = options.skip;
			if (response && response.length) {
				current_count = current_count + response.length;
			}
			if (current_count < options.limit) {
				return cb(null, {
					"limit": options.limit,
					"start": options.skip,
					"count": response.length,
					"items": response
				});
			} else {
				__self.count(data, condition, (error, count) => {
					if (error) {
						return cb(error);
					} else {
						return cb(null, {
							"limit": options.limit,
							"start": options.skip,
							"count": count,
							"items": response
						});
					}
				});
			}
		}
	});
};

Tenant.prototype.count = function (data, condition, cb) {
	let __self = this;
	
	let options = {};
	__self.mongoCore.countDocuments(colName, condition, options, cb);
	
};

Tenant.prototype.listConsoleTenants = function (data, cb) {
	let __self = this;
	
	let options = {
		"skip": 0,
		"limit": 500,
		"sort": {"name": 1}
	};
	if (data && data.limit) {
		options.limit = data.limit;
	}
	if (data && data.start) {
		options.skip = data.start;
	}
	let condition = {
		'$and': [{console: true}]
	};
	if (data.keywords) {
		let rePattern = new RegExp(data.keywords, 'i');
		condition.$and.push({"$or": [{"name": {"$regex": rePattern}}, {"code": {"$regex": rePattern}}]});
	}
	if (data && data.type) {
		condition.$and.push({'type': data.type});
	}
	
	let find = (condition) => {
		__self.mongoCore.find(colName, condition, options, (error, response) => {
			if (error) {
				return cb(error);
			} else {
				let current_count = options.skip;
				if (response && response.length) {
					current_count = current_count + response.length;
				}
				if (current_count < options.limit) {
					return cb(null, {
						"limit": options.limit,
						"start": options.skip,
						"count": response.length,
						"items": response
					});
				} else {
					__self.count(data, condition, (error, count) => {
						if (error) {
							return cb(error);
						} else {
							return cb(null, {
								"limit": options.limit,
								"start": options.skip,
								"count": count,
								"items": response
							});
						}
					});
				}
			}
		});
	};
	
	if (data.scope === "other") {
		__self.validateId(data.id, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition.$and.push({"_id": {"$ne": id}});
			find(condition);
		});
	} else {
		find(condition);
	}
};

Tenant.prototype.listAllTenants = function (data, cb) {
	let __self = this;
	
	let fields = null;
	if (data) {
		if (data.fields && Array.isArray(data.fields) && data.fields.length > 0) {
			fields = {};
			data.fields.forEach((oneField) => {
				fields[oneField] = 1;
			});
		}
	}
	
	__self.mongoCore.find(colName, {}, {"fields": fields}, cb);
};

Tenant.prototype.countTenants = function (data, cb) {
	let __self = this;
	if (!data || !data.name) {
		let error = new Error("name is required.");
		return cb(error, null);
	}
	
	let condition = {
		name: data.name
	};
	
	if (data.code) {
		condition.code = data.code;
	}
	let options = {};
	__self.mongoCore.countDocuments(colName, condition, options, cb);
};

Tenant.prototype.generateId = function () {
	let __self = this;
	return __self.mongoCore.ObjectId();
};

Tenant.prototype.addTenant = function (data, cb) {
	let __self = this;
	
	if (!data || !data.code || !data.name) {
		let error = new Error("name and code are required.");
		return cb(error, null);
	}
	__self.mongoCore.insertOne(colName, data, {}, (err, record) => {
		if (record && Array.isArray(record)) {
			record = record [0];
		}
		return cb(err, record);
	});
};

Tenant.prototype.deleteTenant = function (data, cb) {
	let __self = this;
	
	if (!data || !(data._id || data.code)) {
		let error = new Error("id or code is required.");
		return cb(error, null);
	}
	
	let condition = {};
	
	if (data._id) {
		condition._id = data._id;
	} else {
		condition.code = data.code;
	}
	__self.mongoCore.deleteOne(colName, condition, {}, (err, count) => {
		return cb(err, count);
	});
};

Tenant.prototype.updateTenant = function (data, cb) {
	let __self = this;
	if (!data || !data._id) {
		let error = new Error("_id is required.");
		return cb(error, null);
	}
	
	let condition = {'_id': data._id};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {}
	};
	if (data.description) {
		fields.$set.description = data.description;
	}
	
	if (data.name) {
		fields.$set.name = data.name;
	}
	
	if (data.tag) {
		fields.$set.tag = data.tag;
	}
	
	if (data.profile) {
		fields.$set.profile = data.profile;
	}
	if (data.applications) {
		fields.$set.applications = data.applications;
	}
	
	if (data.oauth) {
		fields.$set.oauth = data.oauth;
	}
	
	if (Object.keys(fields.$set).length === 0) {
		//nothing to update
		return cb(null, 0);
	}
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, result) => {
		if (err) {
			return cb(err);
		} else {
			if (result && result.nModified) {
				result = result.nModified;
			} else {
				if (result && result.ok && result.upserted && Array.isArray(result.upserted)) {
					result = result.upserted.length;
				} else {
					result = 0;
				}
			}
			return cb(err, result);
		}
	});
	
};

Tenant.prototype.removeApplication = function (data, cb) {
	let __self = this;
	if (!data || !data._id || !data.appId) {
		let error = new Error("_id and appId are required.");
		return cb(error, null);
	}
	
	let condition = {'_id': data._id};
	let options = {'upsert': false, 'safe': true};
	
	try {
		data.appId = __self.mongoCore.ObjectId(data.appId);
	} catch (e) {
		return cb(e);
	}
	let fields = {
		'$pull': {
			'applications': {
				"appId": __self.mongoCore.ObjectId(data.appId)
			}
		}
	};
	
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, result) => {
		if (err) {
			return cb(err);
		} else {
			if (result && result.nModified) {
				result = result.nModified;
			} else {
				if (result && result.ok && result.upserted && Array.isArray(result.upserted)) {
					result = result.upserted.length;
				} else {
					result = 0;
				}
			}
			return cb(err, result);
		}
	});
};

Tenant.prototype.removeApplicationKey = function (data, cb) {
	let __self = this;
	if (!data || !data._id || !data.appId || !data.key) {
		let error = new Error("_id, appId, and key are required.");
		return cb(error, null);
	}
	try {
		data.appId = __self.mongoCore.ObjectId(data.appId);
	} catch (e) {
		return cb(e);
	}
	let condition = {
		'_id': data._id,
		'applications.appId': data.appId
	};
	let options = {'upsert': false, 'safe': true};
	
	let fields = {
		'$pull': {
			'applications.$.keys': {
				"key": data.key
			}
		}
	};
	
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, result) => {
		if (err) {
			return cb(err);
		} else {
			if (result && result.nModified) {
				result = result.nModified;
			} else {
				if (result && result.ok && result.upserted && Array.isArray(result.upserted)) {
					result = result.upserted.length;
				} else {
					result = 0;
				}
			}
			return cb(err, result);
		}
	});
};


Tenant.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Tenant;