"use strict";
const imported = require("../data/import.js");

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

    it("loading tests", (done) => {

        done();
    });
    it("loading use cases", (done) => {


        done();
    });

});