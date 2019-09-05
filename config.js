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
    "console": {
        "product": "DSBRD"
    },
    "errors": {
        426: 'Invalid Product ID provided',
        430: "Tenant not found for this user",
        436: "Unable to find tenants",
        460: "Unable to find product",
        468: "Product already exists",
        469: "Unable to add the product record",
        474: "Missing required field: either id or code",
        601: "Model not found"
    },
    "schema": {
        "commonFields": {
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
            "/tenants": {
                _apiInfo: {
                    "l": "List Tenants",
                    "group": "Tenant",
                    "groupMain": true
                }
            }
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
            }
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
                "commonFields": ['id', 'acl'], //TODO: Create ACL Schema
                "scope": {
                    "source": ["body.scope"],
                    "required": true,
                    "validation": {
                        "type": "object"
                    }
                }
            },
        }
    }
};