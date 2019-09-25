"use strict";

describe("starting tenant integration tests", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("loading product integration tests", (done) => {
        // GET
        require("./get/listTenants.test.js");
        require("./get/getTenant.test.js");

        // POST
        require("./post/addTenant.test.js");

        // PUT
        require("./put/updateProfile.test");
        require("./put/updateTenant.test");
        require('./put/updateAppExtKey.test');
        require('./put/updateAppKey.test');
        require('./put/updateApplication.test');

        // DELETE
        require("./delete/deleteTenant.test.js");

        done();
    });

});