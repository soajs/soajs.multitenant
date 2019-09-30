
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const imported = require("../data/import.js");

describe("Starting Unit test", () => {

    before((done) => {
        let rootPath = process.cwd();
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/provision_unit/", (err, msg) => {
            if (err) {
	            console.log(err);
            }
            if (msg){
	            console.log(msg);
            }
            done();
        });
    });

    it("Unit test for BL", (done) => {
        require("./bl/index.test.js");
        require("./bl/tenant.test.js");
        require("./bl/product.test.js");
        done();
    });

    it("Unit test for Model", (done) => {
        // Product
        require("./model/mongo/product.test.js");
        require("./model/mongo/product.indexes.test.js");

        //Tenant
        require("./model/mongo/tenant.test.js");
        done();
    });

    it("Unit test for lib", (done) => {
        require("./lib/sanitize.test.js");
        done();
    });

    after((done) => {
        done();
    });

});