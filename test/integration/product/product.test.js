
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
		require("./get/getscope_raw.test.js");
		require("./get/getACL_ui.test.js");
		require("./get/getPackageAcl_raw.test");
		require("./get/getPackageACL_ui.test.js");
		require("./get/getPackageACL_service.test");
		require("./get/getPackageACL_api.test");
		require("./get/getScopeACL_service.test");
		require("./get/getScopeACL_api.test");
		
		// POST
		require("./post/addProduct.test.js");
		require("./post/addPackage.test.js");
		
		// PUT
		require("./put/purgeProduct.test.js");
		require("./put/updateProduct.test.js");
		require("./put/updateScope.test.js");
		require("./put/updateScope_ENV.test");
		require("./put/updatePackage.test.js");
		require("./put/updatePackage_acl.test.js");
		require("./put/updateScope_service.test");
		require("./put/updateScope_api.test");
		require("./put/updatePackage_api.test");
		require("./put/updatePackage_service.test");
		
		// DELETE
		require("./delete/deleteProduct.test.js");
		require("./delete/deletePackage.test.js");
		
		done();
	});
	
});