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


        //* DELETE

        service.delete("/product", (req, res) => {
            bl.product.delete(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });


        //* PUT

        service.put("/product/purge", (req, res) => {
            bl.product.purge(req.soajs, req.soajs.inputmaskData, (error, data) => {
                return res.json(req.soajs.buildResponse(error, data));
            });
        });


        service.start();
    });
});