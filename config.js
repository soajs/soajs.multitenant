'use strict';

let aclSchema = require("./schemas/acl");
let scopeSchema = require("./schemas/scope");

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
    "oauth": true,
    "extKeyRequired": true,

    "errors": {
        400: "Business logic required data are missing.",
        450: "Unable to find tenant",

        460: "Unable to find product",
        461: "Unable to find package",
        466: "You are not allowed to remove the product you are currently logged in with.",
	    467: "Package already exists",
        468: "Product already exists.",
	    
        470: "Unable to update product.",
	    
        500: "You cannot modify or delete a locked record.",
	    
        601: "Model not found.",
        602: "Model error: ",

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
            "_TTL": {
                "source": ['body._TTL'],
                "required": true,
                "validation": {
                    "type": "string",
                    "enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
                }
            },
        },
	    
        "get": {
            "/products": {
                _apiInfo: {
                    "l": "List products",
                    "group": "Product",
                    "groupMain": true
                }
            },
            "/products/console": {
                _apiInfo: {
                    "l": "List console products",
                    "group": "Console product",
                    "groupMain": true
                }
            },
            "/product": {
                _apiInfo: {
                    "l": "Get product",
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
                    "l": "List product packages",
                    "group": "Product"
                },
                "commonFields": ['id']
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Get product package",
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
	        "/tenant" :{
		        _apiInfo: {
			        "l": "Get tenant",
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
	        "/tenants" :{
		        _apiInfo: {
			        "l": "List tenants",
			        "group": "Tenant"
		        },
		        "type": {
			        "source": ['query.type'],
			        "required": false,
			        "validation": {
				        "type": "string",
				        "enum": ["product", "client"]
			        }
		        }
	        }
        },
	    
        "post": {
            "/product": {
                _apiInfo: {
                    "l": "Add product",
                    "group": "Product",
                    "groupMain": true
                },
                "commonFields": ['description', 'name'],
                "code": {
                    "source": ['body.code'],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                },
	            "scope": {
		            'source': ['body.scope'],
		            'required': false,
		            'validation': {
			            "type": "object",
			            "properties": {
				            "acl": scopeSchema
			            }
		            }
	            }
            },
	        
            "/product/package": {
                _apiInfo: {
                    "l": "Add package to product",
                    "group": "Product"
                },
                "commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
                "code": {
                    "source": ["body.code"],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                },
	            "tags": {
		            "source": ['body.tags'],
		            // "required": false,
		            "validation": {
			            "type": "array",
			            "items": {
				            "required": false,
				            "type": "string",
				            "uniqueItems": true,
				            "minItems": 1
			            }
		            }
	            },
            },

        },
	    
        "delete": {
            "/product": {
                _apiInfo: {
                    "l": "Delete product",
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
			        "l": "Delete product package",
			        "group": "Product"
		        },
		        "commonFields": ['id'],
		        "packageCode": {
			        "source": ['query.packageCode'],
			        "required": true,
			        "validation": {
				        "type": "string"
			        }
		        }
	        },

        },
	    
        "put": {
            "/product/purge": {
                _apiInfo: {
                    "l": "Purge ACL for a Product and all its packages",
                    "group": "Product"
                },
                "commonFields": ['id']
            },
	        
	        "/product": {
		        _apiInfo: {
			        "l": "Update product",
			        "group": "Product"
		        },
		        "commonFields": ['id', 'name', 'description']
	        },
	        
	        "/product/scope": {
		        _apiInfo: {
			        "l": "Update product ACL scope",
			        "group": "Product"
		        },
		        "commonFields": ['id'],
		        "scope": {
			        'source': ['body.scope'],
			        'required': true,
			        'validation': {
				        "type": "object",
				        "properties": {
					        "acl": scopeSchema
				        }
			        }
		        }
	        },
	        
	        "/product/package": {
		        _apiInfo: {
			        "l": "Update product package",
			        "group": "Product"
		        },
		        "commonFields": ['id', 'description', 'acl'],
		        "name": {
			        "source": ["body.name"],
			        "required": true,
			        "validation": {
				        "type": "string"
			        }
		        },
		        "code": {
			        "source": ["body.code"],
			        "required": true,
			        "validation": {
				        "type": "string",
				        "format": "alphanumeric",
				        "minLength": 4,
				        "maxLength": 5
			        }
		        },
		        "_TTL": {
			        "source": ['body._TTL'],
			        "required": false,
			        "validation": {
				        "type": "string",
				        "enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
			        }
		        },
		        "tags": {
			        "source": ['body.tags'],
			        "required": false,
			        "validation": {
				        "type": "array",
				        "items": {
					        "required": false,
					        "type": "string",
					        "uniqueItems": true,
					        "minItems": 1
				        }
			        }
		        }
	        },
        }
    }
};