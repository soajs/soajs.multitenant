
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
        require('./get/getApplications.test');
        require('./get/listApplications.test');
        require('./get/listApplicationKeys.test');
        require('./get/listApplicationKeyConfig.test');
        require('./get/listAppExtKeys.test');

        // POST
        require("./post/addTenant.test.js");
        require("./post/addApplication.test");
        require("./post/addApplicationKey.test.js");
        require("./post/addAppExtKey.test.js");

        // PUT
        require("./put/updateProfile.test");
        require("./put/updateTenant.test");
        require('./put/updateAppExtKey.test');
        require('./put/updateAppKey.test');
        require('./put/updateApplication.test');
        require('./put/updateTenantOauth.test');
        require('./put/updateAppKeyConfig.test');

        // DELETE
        require("./delete/deleteAppExtKeys.test.js");
        require("./delete/deleteAppKey.test.js");
        require("./delete/deleteApplication.test.js");
        require("./delete/deleteTenant.test.js");
        require("./delete/deleteTenants.test.js");

        done();
    });

});