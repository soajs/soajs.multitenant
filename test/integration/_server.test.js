"use strict";
let helper = require("../helper.js");
const imported = require("../data/import.js");
var sampleData = require("soajs.mongodb.data/modules/urac");

let multitenant, controller;

let soajs = require('soajs');

let Mongo = soajs.mongo;
let dbConfig = require("./db.config.test.js");

let multitenancyConfig = dbConfig();
multitenancyConfig.name = "core_provision";
let mongo = new Mongo(multitenancyConfig);

describe("Starting integration tests", function () {
	
	it("importing sample data", (done) => {
		let rootPath = process.cwd();
		imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/provision/", (err, msg) => {
			if (err)
				console.log(err);
			if (msg)
				console.log(msg);
			
			done();
		});
	});
	
    it("clear", function (done) {
        mongo.update('tenants', { code: 'DBTN' }, {
            '$set': {
                locked: false
            }
        }, function () {
            mongo.update('tenants', { code: 'test' }, { '$set': { locked: true } }, function () {
                done();
            });
        });
    });

    after(function (done) {
        controller = require("soajs.controller");
        setTimeout(function () {
            multitenant = helper.requireModule('./index');
            setTimeout(function () {
                require("./product.test.js");
                require("./tenant.test.js");
                done();
            }, 1500);
        }, 1000);
    });
});