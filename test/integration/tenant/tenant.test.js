"use strict";

describe("starting Tenant integration tests", () => {

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
        require("./get/listConsole.test.js");
        require("./get/listApplication.test.js");
        require("./get/listApplicationConfig.test.js");
        require("./get/listApplicationExtKeys.test.js");
        require("./get/listDashboardKeys.test.js");
        require("./get/getApplicationKeys.test.js");
        require("./get/getOAuth.test.js");
        require("./get/getTenant.test.js");

        // POST

        // PUT
        require("./put/updateTenant.test.js");

        // DELETE
        require("./delete/deleteApplicationKey.test.js");
        require("./delete/deleteOAuth.test.js");

        done();
    });

});