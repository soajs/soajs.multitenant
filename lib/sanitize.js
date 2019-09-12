'use strict';
const async = require("async");
const soajsLib = require("soajs.core.libs");

let sanitize = {
	"sanitize": (scope, cb) => {
		async.eachOf(scope, function (env, envKey, call) {
			async.eachOf(env, function (service, serviceKey, callback) {
				let sanitizedVersion = {};
				Object.keys(service).forEach(function (key) {
					sanitizedVersion[soajsLib.version.sanitize(key)] = service[key];
					delete service[key];
				});
				scope[envKey][serviceKey] = sanitizedVersion;
				callback();
			}, call);
		}, cb);
	},
	
	"unsanitize": (record, cb) => {
		if (record && record.scope && record.scope.acl && Object.keys(record.scope.acl > 0)) {
			let scope = record.scope.acl;
			unsanitize(scope, () => {
				record.scope.acl = scope;
				return cb(null, record);
			});
		} else {
			return cb(null, record);
		}
		
		function unsanitize(acl, cb) {
			async.eachOf(acl, function (env, envKey, call) {
				async.eachOf(env, function (service, serviceKey, callback) {
					let sanitizedVersion = {};
					Object.keys(service).forEach(function (key) {
						sanitizedVersion[soajsLib.version.unsanitize(key)] = service[key];
						delete service[key];
					});
					acl[envKey][serviceKey] = sanitizedVersion;
					callback();
				}, call);
			}, cb);
		}
	}
};

module.exports = sanitize;