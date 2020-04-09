/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const soajs = require('soajs');

let config = require('./config.js');
config.packagejson = require("./package.json");

const bl = require("./bl/index.js");

const service = new soajs.server.service(config);

function run(serviceStartCb) {
	service.init(() => {
		bl.init(service, config, (error) => {
			if (error) {
				throw new Error('Failed starting service');
			}
			
			//*** product routes
			
			//* GET
			
			service.get("/products", (req, res) => {
				bl.product.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/products/console", (req, res) => {
				bl.product.listConsole(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product", (req, res) => {
				bl.product.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/packages", (req, res) => {
				bl.product.getPackages(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/package", (req, res) => {
				bl.product.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			
			//* POST
			
			service.post("/product", (req, res) => {
				bl.product.add(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.post("/product/package", (req, res) => {
				bl.product.addPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* DELETE
			
			service.delete("/product", (req, res) => {
				bl.product.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/product/package", (req, res) => {
				bl.product.deletePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			
			//* PUT
			
			service.put("/product/purge", (req, res) => {
				bl.product.purge(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product", (req, res) => {
				bl.product.update(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/scope", (req, res) => {
				bl.product.updateScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/scope/env", (req, res) => {
				bl.product.updateScopeByEnv(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/package", (req, res) => {
				bl.product.updatePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/package/acl/env", (req, res) => {
				bl.product.updatePackageAclByEnv(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//*** tenant routes
			
			//* GET
			
			service.get("/tenant", (req, res) => {
				bl.tenant.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant", (req, res) => {
				bl.tenant.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenants", (req, res) => {
				bl.tenant.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application", (req, res) => {
				bl.tenant.getApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/application", (req, res) => {
				bl.tenant.getApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/applications", (req, res) => {
				bl.tenant.listApplications(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/applications", (req, res) => {
				bl.tenant.listApplications(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application/key/ext", (req, res) => {
				bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* Post
			
			service.post("/tenant", (req, res) => {
				bl.tenant.add(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/application", (req, res) => {
				bl.tenant.addApplication(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/admin/tenant/application", (req, res) => {
				bl.tenant.addApplication(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/application/key", (req, res) => {
				bl.tenant.addApplicationKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/admin/tenant/application/key", (req, res) => {
				bl.tenant.addApplicationKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/application/key/ext", (req, res) => {
				bl.tenant.addApplicationExtKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.addApplicationExtKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* PUT
			
			service.put("/tenant", (req, res) => {
				bl.tenant.updateTenant(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant", (req, res) => {
				bl.tenant.updateTenant(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/profile", (req, res) => {
				bl.tenant.updateProfile(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/profile", (req, res) => {
				bl.tenant.updateProfile(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/application", (req, res) => {
				bl.tenant.updateApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/application", (req, res) => {
				bl.tenant.updateApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			
			service.put("/tenant/application/key", (req, res) => {
				bl.tenant.updateApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/application/key", (req, res) => {
				bl.tenant.updateApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/application/key/ext", (req, res) => {
				bl.tenant.updateApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.updateApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* DELETE
			
			service.delete("/tenant", (req, res) => {
				bl.tenant.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application", (req, res) => {
				bl.tenant.deleteApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application/key", (req, res) => {
				bl.tenant.deleteApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application/key/ext", (req, res) => {
				bl.tenant.deleteApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.start();
		});
	});
}

function stop(serviceStopCb) {
	service.stop(serviceStopCb);
}

module.exports = {
	"runService": (serviceStartCb) => {
		if (serviceStartCb && typeof serviceStartCb === "function") {
			run(serviceStartCb);
		} else {
			run(null);
		}
	},
	"stopService": (serviceStopCb) => {
		if (serviceStopCb && typeof serviceStopCb === "function") {
			stop(serviceStopCb);
		} else {
			stop(null);
		}
	}
};