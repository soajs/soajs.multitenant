'use strict';

let bl = {
    "modelObj": null,
    "model": null,
    "soajs_service": null,
    "localConfig": null,

    "handleError": (soajs, errCode, err) => {
        if (err) {
            soajs.log.error(err);
        }
        return ({
            "code": errCode,
            "msg": bl.localConfig.errors[errCode]
        });
    },

    "mp": {
        "getModel": (soajs) => {
            let l_modelObj = bl.modelObj;
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
            }
            return l_modelObj;
        },
        "closeModel": (soajs, l_modelObj) => {
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj.closeConnection();
            }
        }
    },

    "list": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        l_modelObj.listProducts(bl.localConfig.console, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                console.log(err);
                return cb(bl.handleError(soajs, 460, err), null);
            }
            return cb(null, records);
        });
    },

    "listConsole": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        l_modelObj.listConsoleProducts(bl.localConfig.console, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err));
            }
            return cb(null, records);
        });
    },

    "get": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 474, null));
        }
        let data = {};

        if (inputmaskData.id) {
            data.id = inputmaskData.id;
        } else if (inputmaskData.code) {
            data.code = inputmaskData.code;
        }

        l_modelObj.getProduct(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err), null);
            }
            return cb(null, record);
        });
    },

    "add": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let data = {
            name: inputmaskData.name,
            code: inputmaskData.code,
            description: inputmaskData.description,
            scope: {
                acl: {}
            },
            packages: []
        };

        l_modelObj.checkIfExist(data, (err, count) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 474, err));
            }

            if (count > 0) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 468, err));
            } else {
                l_modelObj.addProduct(data, (err, record) => {
                    bl.mp.closeModel(soajs, l_modelObj);
                    if (err) {
                        return cb(bl.handleError(soajs, 469, err));
                    }
                    return cb(null, record);
                });
            }
        });
    },

    "delete": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 474, null));
        }

        if (inputmaskData.code) {
            data.code = inputmaskData.code;
        } else {
            data.id = inputmaskData.id;
        }

        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, err));
            }
            if (!record) {
                bl.mp.closeModel(soajs, l_modelObj);
                if (inputmaskData.id) {
                    return cb(bl.handleError(soajs, 426, null));
                } else {
                    return cb(bl.handleError(soajs, 477, null));
                }
            }
            if (soajs.tenant.application.product === record.code) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 466, null));
            }
            if (!soajs.tenant.locked && record && record.locked) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 500, null));
            }
            l_modelObj.deleteProduct(data, (err, result) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 475, err));
                }
                return cb(null, result);
            });
        });
    },

    "update": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        data.name = inputmaskData.name;
        data.description = inputmaskData.description;
        data.id = inputmaskData.id;
        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, err));
            }
            if (!record) {
                bl.mp.closeModel(soajs, l_modelObj);
                if (inputmaskData.id) {
                    return cb(bl.handleError(soajs, 426, null));
                } else {
                    return cb(bl.handleError(soajs, 477, null));
                }
            }
            if (soajs.tenant.application.product === record.code) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 466, null));
            }
            if (!soajs.tenant.locked && record && record.locked) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 500, null));
            }
            l_modelObj.updateProduct(data, (err, result) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 476, err));
                }
                return cb(null, result);
            });
        });
    },

    // "updateScope": function (soajs, inputmaskData, cb) {
    //     let l_modelObj = bl.mp.getModel(soajs);
    //     let data = {};
    //
    //     if (!inputmaskData) {
    //         return cb(bl.handleError(soajs, 473, null));
    //     }
    //
    //     data.id = inputmaskData.id;
    //     data.scope = inputmaskData.scope;
    //
    //     l_modelObj.getProduct(data, (err, record) => {
    //         if (err) {
    //             bl.mp.closeModel(soajs, l_modelObj);
    //             return cb(bl.handleError(soajs, 460, err));
    //         }
    //         if (!record) {
    //             if (inputmaskData.id) {
    //                 bl.mp.closeModel(soajs, l_modelObj);
    //                 return cb(bl.handleError(soajs, 426, null));
    //             } else {
    //                 bl.mp.closeModel(soajs, l_modelObj);
    //                 return cb(bl.handleError(soajs, 477, null));
    //             }
    //         }
    //         if (soajs.tenant.application.product === record.code) {
    //             bl.mp.closeModel(soajs, l_modelObj);
    //             return cb(bl.handleError(soajs, 466, null));
    //         }
    //         if (!soajs.tenant.locked && record && record.locked) {
    //             bl.mp.closeModel(soajs, l_modelObj);
    //             return cb(bl.handleError(soajs, 500, null));
    //         }
    //         l_modelObj.updateScope(data, (err, result) => {
    //             bl.mp.closeModel(soajs, l_modelObj);
    //             if (err) {
    //                 return cb(bl.handleError(soajs, 475, null));
    //             }
    //             return cb(null, result);
    //         });
    //     });
    // },

    "listPackages": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let data = {};

        if (inputmaskData.id) {
            data.id = inputmaskData.id;
        } else if (inputmaskData.code) {
            data.code = inputmaskData.code;
        }

        l_modelObj.getProduct(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err), null);
            }
            return cb(null, record.packages);
        });
    },

    "getPackage": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 423, null));
        }
        let data = {};
        let selectedPackage = {};
        let found = false;
        let prefix;


        data.code = inputmaskData.productCode;

        l_modelObj.getProduct(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err), null);
            }
            prefix = record.code + '_';
            record.packages.forEach(pack => {
                if (pack.code === prefix + inputmaskData.packageCode) {
                    selectedPackage = pack;
                    found = true;
                }
            });

            if (!found) {
                return cb(bl.handleError(soajs, 461, err), null);
            } else {
                return cb(null, selectedPackage);
            }
        });
    },

    "deletePackage": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let data = {};

        data.id = inputmaskData.id;

        l_modelObj.getProduct(data, (err, record) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err), null);
            }
            if (record.code + '_' + inputmaskData.packageCode === soajs.tenant.application.package) {
                return cb(bl.handleError(soajs, 467, err), null);
            }
            let found = false;
            let prefix = record.code + '_';

            for (let i = 0; i < record.packages.length; i++) {
                if (record.packages[i].code === prefix + inputmaskData.packageCode) {
                    record.packages.splice(i, 1);
                    found = true;
                    break;
                }
            }

            if (!found) {
                return cb(bl.handleError(soajs, 461, err), null);
            }
            l_modelObj.updateProduct(record, (err, result) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 476, err), null);
                }
                return cb(null, record.packages);
            });
        });
    },


};

module.exports = bl;