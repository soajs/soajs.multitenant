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

        service.get("/products", function (req, res) {
            bl.product.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.get("/products/console", function (req, res) {
            bl.product.listConsole(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.get("/product", function (req, res) {
            bl.product.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.get("/product/packages", function (req, res) {
            bl.product.listPackages(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.get("/product/package", function (req, res) {
            bl.product.getPackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        /*
         * POST
         */

        service.post("/product", function (req, res) {
            bl.product.add(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        /*
         * DELETE
         */

        service.delete("/product", function (req, res) {
            bl.product.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.delete("/product/package", function (req, res) {
            bl.product.deletePackage(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });


        /*
         * PUT
         */

        service.put("/product", function (req, res) {
            bl.product.update(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.put("/product/scope", function (req, res) {
            bl.product.updateScope(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        /**
         * tenant routes
         */
        service.get("/tenants", function (req, res) {
            bl.tenant.list(req.soajs, req.soajs.inputmaskData, config, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });

        service.start();
    });
});