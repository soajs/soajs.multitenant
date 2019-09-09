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
            "msg": bl.localConfig.errors[errCode] + ((err && errCode === 473) ? err.message : "")
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
        l_modelObj.listProducts(null, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err), null);
            }
            return cb(null, records);
        });
    },

    "listConsole": function (soajs, inputmaskData, cb) {
        let l_modelObj = bl.mp.getModel(soajs);
        l_modelObj.listConsoleProducts(null, (err, records) => {
            bl.mp.closeModel(soajs, l_modelObj);
            if (err) {
                return cb(bl.handleError(soajs, 460, err));
            }
            return cb(null, records);
        });
    },

    "get": function (soajs, inputmaskData, cb) {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 474, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
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
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 474, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

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
    //     if (!inputmaskData) {
    //         return cb(bl.handleError(soajs, 473, null));
    //     }
    //
    //     let l_modelObj = bl.mp.getModel(soajs);
    //     let data = {};
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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);

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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);

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
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }
        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        data.id = inputmaskData.id;

        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, err), null);
            }
            if (record.code + '_' + inputmaskData.packageCode === soajs.tenant.application.package) {
                bl.mp.closeModel(soajs, l_modelObj);
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
                bl.mp.closeModel(soajs, l_modelObj);
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

    "addPackage": function (soajs, inputmaskData, cb) {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        data.id = inputmaskData.id;

        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, null));
            }
            if (record && record.locked) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 500, null));
            }
            let prefix = record.code.toUpperCase() + '_';

            if (inputmaskData.code) {
                record.packages.forEach(pack => {
                    if (pack.code === prefix + inputmaskData.code) {
                        return cb(bl.handleError(soajs, 467, null));
                    }
                });
            }

            l_modelObj.listEnvironments(record, (err, environments) => {
                if (err) {
                    bl.mp.closeModel(soajs, l_modelObj);
                    return cb(bl.handleError(soajs, 437, err));
                }
                let status = false;
                let postedEnvs = Object.keys(inputmaskData.acl);
                for (let i = 0; i < environments.length; i++) {
                    if (postedEnvs.indexOf(environments[i].code.toLowerCase()) !== -1) {
                        status = true;
                        break;
                    }
                }
                if (!status) {
                    //return err
                }

                let newPackage = {
                    "code": prefix + inputmaskData.code.toUpperCase(),
                    "name": inputmaskData.name,
                    "description": inputmaskData.description,
                    "acl": inputmaskData.acl,
                    "_TTL": inputmaskData._TTL * 3600 * 1000
                };

                record.packages.push(newPackage);

                l_modelObj.updateProduct(record, (err, result) => {
                    bl.mp.closeModel(soajs, l_modelObj);
                    if (err) {
                        return cb(bl.handleError(soajs, 476, err), null);
                    }
                    return cb(null, result);
                });
            });
            // TODO: check
        });
    },

    "updatePackage": function (soajs, inputmaskData, cb) {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        data.id = inputmaskData.id;

        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, null));
            }
            if (!record) {
                bl.mp.closeModel(soajs, l_modelObj);
                // TODO: Display error
            }
            if (record && record.locked) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 500, null));
            }
            let prefix = record.code.toUpperCase() + '_';

            l_modelObj.listEnvironments(record, (err, environments) => {
                if (err) {
                    bl.mp.closeModel(soajs, l_modelObj);
                    return cb(bl.handleError(soajs, 437, err));
                }
                let status = false;
                let postedEnvs = Object.keys(inputmaskData.acl);
                if (postedEnvs.length === 0) {
                    status = true;
                } else {
                    for (var i = 0; i < environments.length; i++) {
                        if (postedEnvs.indexOf(environments[i].code.toLowerCase()) !== -1) {
                            status = true;
                            break;
                        }
                    }
                }
                if (!status) {
                    bl.mp.closeModel(soajs, l_modelObj);
                    //TODO: return err
                }

                let found = false;
                for (let i = 0; i < record.packages.length; i++) {
                    if (record.packages[i].code.toUpperCase() === prefix + inputmaskData.code.toUpperCase()) {
                        record.packages[i].name = inputmaskData.name;
                        record.packages[i].description = inputmaskData.description;
                        record.packages[i]._TTL = inputmaskData._TTL * 3600 * 1000;
                        record.packages[i].acl = inputmaskData.acl;
                        found = true;
                        break;
                    }
                }

                record.packages.forEach(pack => {
                    if (pack.code.toUpperCase() === prefix + inputmaskData.code.toUpperCase()) {
                        pack.name = inputmaskData.name;
                        pack.description = inputmaskData.description;
                        pack._TTL = inputmaskData._TTL * 3600 * 1000;
                        pack.acl = inputmaskData.acl;
                        found = true;
                    }
                });

                if (!found) {
                    bl.mp.closeModel(soajs, l_modelObj);
                    return cb(bl.handleError(soajs, 461, null));
                }

                l_modelObj.updateProduct(record, (err, result) => {
                    bl.mp.closeModel(soajs, l_modelObj);
                    if (err) {
                        return cb(bl.handleError(soajs, 476, err), null);
                    }
                    return cb(null, result);
                });
            });
            // TODO: check
        });
    },

    "purgeProduct": function (soajs, inputmaskData, cb) {
        if (!inputmaskData) {
            return cb(bl.handleError(soajs, 473, null));
        }

        let l_modelObj = bl.mp.getModel(soajs);
        let data = {};

        data.id = inputmaskData.id;

        l_modelObj.getProduct(data, (err, record) => {
            if (err) {
                bl.mp.closeModel(soajs, l_modelObj);
                return cb(bl.handleError(soajs, 460, null));
            }
            record.scope = {
                acl: {}
            };

            //todo: add locked check
            record.packages.forEach(pack => {
                pack.acl = {};
            });
            l_modelObj.updateProduct(record, (err, result) => {
                bl.mp.closeModel(soajs, l_modelObj);
                if (err) {
                    return cb(bl.handleError(soajs, 476, err), null);
                }
                return cb(null, result);
            });
        });
    }
};

module.exports = bl;