"use strict";
let shell = require('shelljs');
let assert = require('assert');
let helper = require("../helper.js");
let sampleData = require("soajs.mongodb.data/modules/multitenant");
let multitenant, controller;

let soajs = require('soajs');

let Mongo = soajs.mongo;
let dbConfig = require("./db.config.test.js");

let multitenancyConfig = dbConfig();
multitenancyConfig.name = "core_provision";
let mongo = new Mongo(multitenancyConfig);

describe("importing sample data", function () {

    it("do import", function (done) {
        shell.pushd(sampleData.dir);
        shell.exec("chmod +x " + sampleData.shell, function (code) {
            assert.equal(code, 0);
            shell.exec(sampleData.shell, function (code) {
                assert.equal(code, 0);
                shell.popd();
                done();
            });
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
                require("./index.test.js");
                done();
            }, 1500);
        }, 1000);
    });
});