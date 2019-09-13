"use strict";

describe("starting product integration tests", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("loading product integration tests", (done) => {
        // GET
        require("./get/listProducts.test.js");
       require("./get/getProduct.test.js");
       require("./get/listPackages.test.js");
       require("./get/getPackage.test.js");

        // POST
        require("./post/addProduct.test.js");
       require("./post/addPackage.test.js");

        // PUT
        require("./put/purgeProduct.test.js");
        require("./put/updateProduct.test.js");
        require("./put/updateScope.test.js");
        require("./put/updatePackage.test.js");

        // DELETE
        require("./delete/deleteProduct.test.js");
       require("./delete/deletePackage.test.js");

        done();
    });

});