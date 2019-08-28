'use strict';
const soajs = require('soajs');
const config = require('./config.js');
config.packagejson = require("./package.json");
const service = new soajs.server.service(config);


service.init(function () {

    service.start();
});