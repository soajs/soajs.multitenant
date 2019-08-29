'use strict';

const async = require("async");
const fs = require("fs");
const defaultModel = "mongo";

let SSOT = {};
let model = process.env.SOAJS_SERVICE_MODEL || null;

function init(service, localConfig, cb) {
	
	model = model || defaultModel;
	let BLs = ["product", "tenant"];
	let fillModels = (blName, cb) => {
		let typeModel = __dirname + `/../model/${model}/${blName}.js`;
		
		if (fs.existsSync(typeModel)) {
			SSOT[`${blName}Model`] = require(typeModel);
			SSOT[`${blName}ModelObj`] = new SSOT[`${blName}Model`](service, null);
		}
		if (SSOT[`${blName}ModelObj`]) {
			let temp = require(`./${blName}.js`);
			temp.modelObj = SSOT[`${blName}ModelObj`];
			temp.model = SSOT[`${blName}Model`];
			BL[blName] = temp;
			return cb(null);
		} else {
			return cb({name: blName, model: typeModel});
		}
	};
	async.each(BLs, fillModels, function (err, result) {
		if (err) {
			service.log.error(`Requested model not found. make sure you have a model for ${err.name} @ ${err.model}`);
			return cb({"code": 601, "msg": localConfig.errors[601]});
		}
		return cb(null);
	});
}

let BL = {
	init: init,
	product: null,
	tenant: null
};

module.exports = BL;