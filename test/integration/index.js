"use strict";
const imported = require("../data/import.js");
let helper = require("../helper.js");

let multitenant, controller;

describe("starting integration tests", () => {

    before((done) => {
        let rootPath = process.cwd();
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/provision/", (err, msg) => {
            if (err)
                console.log(err);
            if (msg)
                console.log(msg);

            done();
        });
    });

    it("Starting Controller and Multitenant service", (done) => {
        controller = require("soajs.controller");
        console.log("Controller!");
        setTimeout(function () {
            multitenant = helper.requireModule('./index');
            console.log("Multitenant", multitenant);
            setTimeout(function () {
                done();
            }, 1500);
        }, 1000);
    });

    it("loading tests", (done) => {
        require("./product.test.js");
        require("./tenant.test.js");
        done();
    });

    it("loading use cases", (done) => {
        done();
    });
});