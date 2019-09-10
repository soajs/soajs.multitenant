'use strict';

const soajs = require('soajs');

let config = require('./config.js');
config.packagejson = require("./package.json");

const bl = require("./bl/index.js");

const service = new soajs.server.service(config);

service.init(() => {
    bl.init(service, config, (error) => {
        if (error) {
            throw new Error('Failed starting service');
        }
        /**
         * product routes
         */

        /*
         * GET
         */

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

        // service.get("/product/packages", (req, res) => {
        //     bl.product.listPackages(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/product/package", (req, res) => {
        //     bl.product.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });


        /*
         * POST
         */

        service.post("/product", (req, res) => {
            bl.product.add(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        // service.post("/product/package", (req, res) => {
        //     bl.product.addPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });

        /*
         * DELETE
         */

        service.delete("/product", (req, res) => {
            bl.product.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        // service.delete("/product/package", (req, res) => {
        //     bl.product.deletePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });


        /*
         * PUT
         */

        // service.put("/product", (req, res) => {
        //     bl.product.update(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.put("/product/scope", (req, res) => {
        //     bl.product.updateScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.put("/product/purge", (req, res) => {
        //     bl.product.purgeProduct(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.put("/product/package", (req, res) => {
        //     bl.product.updatePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });


        /**
         * tenant routes
         */
        // service.get("/tenants", (req, res) => {
        //     bl.tenant.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenants/console", (req, res) => {
        //     bl.tenant.listConsole(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant", (req, res) => {
        //     bl.tenant.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/oauth", (req, res) => {
        //     bl.tenant.getOAuth(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/application", (req, res) => {
        //     bl.tenant.listApplications(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/application/keys", (req, res) => {
        //     bl.tenant.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/application/keys/ext", (req, res) => {
        //     bl.tenant.listApplicationExtKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/application/key/config", (req, res) => {
        //     bl.tenant.listApplicationConfig(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.get("/tenant/dashboard/keys", (req, res) => {
        //     bl.tenant.listDashboardKeys(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });


        /*
         * PUT
         */
        // service.put("/tenant", (req, res) => {
        //     bl.tenant.update(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });

        /*
         * DELETE
         */

        // service.delete("/tenant/oauth", (req, res) => {
        //     bl.tenant.deleteOAuth(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });
        //
        // service.delete("/tenant/application/key", (req, res) => {
        //     bl.tenant.deleteApplicationKey(req.soajs, req.soajs.inputmaskData, (error, data) => {
        //         return res.json(req.soajs.buildResponse(error, data));
        //     });
        // });

        service.start();
    });
});