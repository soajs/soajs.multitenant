let aclSchema = require("./schemas/acl");

module.exports = {
    type: 'service',
    prerequisites: {
        cpu: '',
        memory: ''
    },
    "serviceVersion": 1,
    "serviceName": "multitenant",
    "serviceGroup": "SOAJS Core Services",
    "servicePort": 4004,
    "requestTimeout": 30,
    "requestTimeoutRenewal": 5,
    "oauth": false,
    "extKeyRequired": true,
    "errors": {
        421: "Unable to update the tenant record",
        423: "An id must be provided",
        426: 'Invalid Product ID provided',
        430: "Tenant not found for this user",
        436: "Unable to find tenants",
        437: "Unable to get the environment records",
        460: "Unable to find products",
        461: "Unable to find package",
        464: "You are not allowed to remove the key you are currently logged in with",
        466: "You are not allowed to remove the product you are currently logged in with",
        467: "Package already exists",
        468: "Product already exists",
        469: "Unable to add the product record",
        473: "Missing required fields",
        474: "Missing required field: either id or code",
        475: "Unable to remove product record",
        476: "Unable to update product record",
        477: "Invalid product code provided",
        500: "This record is locked. You cannot modify or delete it",
        601: "Model not found"
    },
    "schema": {
        "commonFields": {
            "acl": aclSchema,
            "description": {
                "source": ['body.description'],
                "required": false,
                "validation": {
                    "type": "string"
                }
            },
            "name": {
                "source": ['body.name'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
            "id": {
                "source": ['query.id'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
            "packageCode": {
                "source": ['body.packageCode'],
                "required": true,
                "validation": {
                    "type": "string",
                    "format": "alphanumeric"
                }
            },
            "_TTL": { //TODO: CHECK TTL
                "source": ['body._TTL'],
                "required": true,
                "validation": {
                    "type": "string",
                    "enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
                }
            },
            'appId': {
                "source": ['query.appId'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
            'key': {
                "source": ['query.key'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
        },
        "get": {
            "/products": {
                _apiInfo: {
                    "l": "List Products",
                    "group": "Product",
                    "groupMain": true
                }
            },
            "/products/console": {
                _apiInfo: {
                    "l": "List Console Products",
                    "group": "Product",
                    "groupMain": true
                }
            },
            "/product": {
                _apiInfo: {
                    "l": "Get Product",
                    "group": "Product",
                    "groupMain": true
                },
                id: {
                    "source": ['query.id'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                code: {
                    "source": ["query.code"],
                    "required": false,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "maxLength": 6
                    }
                }
            },
            "/product/packages": {
                _apiInfo: {
                    "l": "List Product Packages",
                    "group": "Product"
                },
                "commonFields": ['id']
            },

            "/product/package": {
                _apiInfo: {
                    "l": "Get Product Package",
                    "group": "Product"
                },
                "packageCode": {
                    "source": ["query.packageCode"],
                    "required": true,
                    "validation": {
                        "type": "string"
                    }
                },
                "productCode": {
                    "source": ["query.productCode"],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "maxLength": 6
                    }
                }
            },

            // Tenant APIs

            "/tenants": {
                _apiInfo: {
                    "l": "List Tenants",
                    "group": "Tenant",
                    "groupMain": true
                }
            },
            "/tenants/console": {
                _apiInfo: {
                    "l": "List Console Tenants",
                    "group": "Console Tenant"
                },
                "type": {
                    "source": ['query.type'],
                    "required": false,
                    "validation": {
                        "type": "string",
                        "enum": ["admin", "product", "client"]
                    }
                },
                "negate": {
                    "source": ['query.negate'],
                    "required": false,
                    "default": false,
                    "validation": {
                        "type": "boolean"
                    }
                }
            },
            "/tenant": {
                _apiInfo: {
                    "l": "Get Tenant",
                    "group": "Tenant"
                },
                "id": {
                    "source": ['query.id'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                "code": {
                    "source": ["query.code"],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                }
            },

            "/tenant/oauth": {
                _apiInfo: {
                    "l": "Get Tenant oAuth Configuration",
                    "group": "Tenant oAuth"
                },
                "commonFields": ['id']
            },

            "/tenant/application": {
                _apiInfo: {
                    "l": "List Tenant Applications",
                    "group": "Tenant Application"
                },
                "commonFields": ['id']
            },
            "/tenant/application/keys": {
                _apiInfo: {
                    "l": "List Tenant Application Keys",
                    "group": "Tenant Application"
                },
                "commonFields": ['id', 'appId']
            },
            "/tenant/application/keys/ext": {
                _apiInfo: {
                    "l": "List Tenant Application External Keys",
                    "group": "Tenant Application"
                },
                "commonFields": ['id', 'appId', 'key']
            },
            "/tenant/application/key/config": {
                _apiInfo: {
                    "l": "List Tenant Application Key Configuration",
                    "group": "Tenant Application"
                },
                "commonFields": ['id', 'appId', 'key']
            },
            "/tenant/dashboard/keys": {
                _apiInfo: {
                    "l": "List Dashboard Tenant Keys",
                    "group": "Dashboard Tenants"
                },
                "code": {
                    "source": ["query.code"],
                    "required": true,
                    "validation": {
                        "type": "string"
                    }
                }
            },
        },
        "post": {
            "/product": {
                _apiInfo: {
                    "l": "Add Product",
                    "group": "Product",
                    "groupMain": true
                },
                commonFields: ['description', 'name'],
                code: {
                    "source": ['body.code'],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                }
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Add Product Package",
                    "group": "Product"
                },
                "commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
                "code": {
                    "source": ["body.code"],
                    "required": false,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                }
            },

            //Tenant APIs

            "/tenant/application/": {
                _apiInfo: {
                    "l": "Add Tenant Application",
                    "group": "Tenant Application"
                },
                "commonFields": ['id', '_TTL', 'description', 'acl', 'productCode', 'packageCode']
            },
        },
        "delete": {
            "/product": {
                _apiInfo: {
                    "l": "Add Product",
                    "group": "Product",
                    "groupMain": true
                },
                "id": {
                    "source": ['query.id'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                "code": {
                    "source": ['query.code'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                }
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Delete Product Package",
                    "group": "Product"
                },
                "commonFields": ['id'],
                "packageCode": {
                    "source": ['query.packageCode'],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric"
                    }
                }
            },
            "/tenant/oauth": {
                _apiInfo: {
                    "l": "Delete Tenant oAuth Configuration",
                    "group": "Tenant oAuth"
                },
                "commonFields": ['id']
            },
            "/tenant/application/key": {
                _apiInfo: {
                    "l": "Delete Tenant Application Key",
                    "group": "Tenant Application"
                },
                "commonFields": ['id', 'appId', 'key']
            }
        },
        "put": {
            "/product": {
                _apiInfo: {
                    "l": "Update Product",
                    "group": "Product"
                },
                "commonFields": ['id', 'name', 'description']
            },
            "/product/scope": {
                _apiInfo: {
                    "l": "Update Product Scope",
                    "group": "Product"
                },
                "commonFields": ['id', 'acl'],
                "scope": {
                    "source": ["body.scope"],
                    "required": true,
                    "validation": {
                        "type": "object"
                    }
                }
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Update Product Package",
                    "group": "Product"
                },
                "commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
                "code": {
                    "source": ["query.code"],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric"
                    }
                }
            },

            "/product/purge": {
                _apiInfo: {
                    "l": "Purge Product",
                    "group": "Product"
                },
                "commonFields": ['id']
            },

            // Tenant APIs

            "/tenant": {
                _apiInfo: {
                    "l": "Update Tenant",
                    "group": "Tenant"
                },
                "commonFields": ['id', 'name', 'description'],
                "type": {
                    "source": ['body.type'],
                    "required": false,
                    "default": "client",
                    "validation": {
                        "type": "string",
                        "enum": ["admin", "product", "client"]
                    }
                },
                "tag": {
                    "source": ['body.tag'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                "profile": {
                    "source": ['body.profile'],
                    "required": false,
                    "validation": {
                        "type": "object"
                    }
                },
            },
        }
    }
};