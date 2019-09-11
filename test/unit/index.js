"use strict";
const imported = require("../data/import.js");

describe("Starting Unit test", () => {

    before((done) => {
        let rootPath = process.cwd();
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/provision_unit/", (err, msg) => {
            if (err)
                console.log(err);
            if (msg)
                console.log(msg);
            done();
        });
    });

    it("Unit test for BL", (done) => {
        require("./bl/index.test.js");
        require("./bl/product.test.js");
        done();
    });

    it("Unit test for Model", (done) => {
        require("./model/mongo/product.test.js");
        done();
    });

    after((done) => {
        done();
    });

});