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
const sdk = require("./lib/sdk.js");
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
			service.get("/product/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/packages", (req, res) => {
				bl.product.getPackages(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/packages", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getPackages(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/package", (req, res) => {
				bl.product.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/package", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/acl/scope/raw", (req, res) => {
				bl.product.getAclScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/acl/scope/raw", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getAclScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/package/acl/raw", (req, res) => {
				bl.product.getPackageAclScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/package/acl/raw", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getPackageAclScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/acl/ui", (req, res) => {
				bl.product.getUIProductAcl(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/acl/ui", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getUIProductAcl(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/package/acl/ui", (req, res) => {
				bl.product.getUIProductPackageAcl(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/package/acl/ui", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getUIProductPackageAcl(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/package/acl/service", (req, res) => {
				bl.product.getPackagesPreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/console/package/acl/service", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getPackagesPreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/package/acl/api", (req, res) => {
				bl.product.getPackagesPreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/package/acl/api", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getPackagesPreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/acl/scope/service", (req, res) => {
				bl.product.getScopePreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/console/acl/scope/service", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getScopePreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/product/acl/scope/api", (req, res) => {
				bl.product.getScopePreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/product/console/acl/scope/api", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.getScopePreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* POST
			
			service.post("/product", (req, res) => {
				bl.product.add(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/product/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.add(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/product/package", (req, res) => {
				bl.product.addPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/product/console/package", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.delete("/product/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/product/package", (req, res) => {
				bl.product.deletePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/product/console/package", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.put("/product/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.update(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/scope", (req, res) => {
				bl.product.updateScope(req.soajs, req.soajs.inputmaskData, (error, data, code) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"type": "Multitenant",
						"section": "ACL",
						"locator": [code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/scope/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updateScope(req.soajs, req.soajs.inputmaskData, (error, data, code) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"type": "Multitenant",
						"section": "ACL",
						"locator": [code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/scope/env", (req, res) => {
				bl.product.updateScopeByEnv(req.soajs, req.soajs.inputmaskData, (error, data, code) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/console/scope/env", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updateScopeByEnv(req.soajs, req.soajs.inputmaskData, (error, data, code) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/package", (req, res) => {
				bl.product.updatePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/console/package", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updatePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/product/package/acl/env", (req, res) => {
				bl.product.updatePackageAclByEnv(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/console/package/acl/env", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updatePackageAclByEnv(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.code],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/package/acl/service", (req, res) => {
				bl.product.updatePackagesPreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode, req.soajs.inputmaskData.packageCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/console/package/acl/service", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updatePackagesPreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode, req.soajs.inputmaskData.packageCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/package/acl/api", (req, res) => {
				bl.product.updatePackagesPreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode, req.soajs.inputmaskData.packageCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/product/console/package/acl/api", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updatePackagesPreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode, req.soajs.inputmaskData.packageCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			
			service.put("/product/acl/scope/service", (req, res) => {
				bl.product.updateScopePreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/product/console/acl/scope/service", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updateScopePreviewService(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/product/acl/scope/api", (req, res) => {
				bl.product.updateScopePreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/product/console/acl/scope/api", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.product.updateScopePreviewApi(req.soajs, req.soajs.inputmaskData, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Multitenant",
						"section": "ACL",
						"locator": [req.soajs.inputmaskData.productCode],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
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
			
			service.get("/tenant/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenants", (req, res) => {
				bl.tenant.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenants/console", (req, res) => {
				bl.tenant.listConsole(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application", (req, res) => {
				bl.tenant.getApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/console/application", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.get("/tenant/console/applications", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.listApplications(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/applications", (req, res) => {
				bl.tenant.listApplications(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application/key", (req, res) => {
				bl.tenant.listApplicationKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/console/application/key", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.listApplicationKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/application/key", (req, res) => {
				bl.tenant.listApplicationKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application/key/ext", (req, res) => {
				bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/console/application/key/ext", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/application/key/config", (req, res) => {
				bl.tenant.listApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/console/application/key/config", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.listApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/application/key/config", (req, res) => {
				bl.tenant.listApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/oauth/users", (req, res) => {
				bl.tenant.listTenantOauthUsers(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/tenant/console/oauth/users", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.listTenantOauthUsers(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/admin/tenant/oauth/users", (req, res) => {
				bl.tenant.listTenantOauthUsers(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* Post
			
			service.post("/tenant", (req, res) => {
				bl.tenant.add(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.add(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/application", (req, res) => {
				bl.tenant.addApplication(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/console/application", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.post("/tenant/console/application/key", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.post("/tenant/console/application/key/ext", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.addApplicationExtKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.addApplicationExtKey(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/oauth/user", (req, res) => {
				bl.tenant.addOauthUser(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/tenant/console/oauth/user", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.addOauthUser(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/admin/tenant/oauth/user", (req, res) => {
				bl.tenant.addOauthUser(req.soajs, req.soajs.inputmaskData, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//* PUT
			
			service.put("/tenant", (req, res) => {
				bl.tenant.updateTenant(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.put("/tenant/console/profile", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.put("/tenant/console/application", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.put("/tenant/console/application/key", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
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
			
			service.put("/tenant/console/application/key/ext", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.updateApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/application/key/ext", (req, res) => {
				bl.tenant.updateApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			
			service.put("/tenant/application/key/config", (req, res) => {
				bl.tenant.updateApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/console/application/key/config", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.updateApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/application/key/config", (req, res) => {
				bl.tenant.updateApplicationKeyConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/oauth", (req, res) => {
				bl.tenant.updateOauth(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/console/oauth", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.updateOauth(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/oauth", (req, res) => {
				bl.tenant.updateOauth(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/oauth/user", (req, res) => {
				bl.tenant.updateOuathUser(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/tenant/console/oauth/user", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.updateOuathUser(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/admin/tenant/oauth/user", (req, res) => {
				bl.tenant.updateOuathUser(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			//* DELETE
			
			service.delete("/tenant", (req, res) => {
				bl.tenant.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/console", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application", (req, res) => {
				bl.tenant.deleteApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/console/application", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.deleteApplication(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application/key", (req, res) => {
				bl.tenant.deleteApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/console/application/key", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.deleteApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/application/key/ext", (req, res) => {
				bl.tenant.deleteApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/tenant/console/application/key/ext", (req, res) => {
				req.soajs.inputmaskData.soajs = true;
				bl.tenant.deleteApplicationExternalKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.start(serviceStartCb);
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