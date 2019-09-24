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
	"tenant": {
		"generatedCodeLength": 5,
		"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		"expDateTTL": 86400000
	},
	
	"errors": {
		400: "Business logic required data are missing",
		450: "Unable to find tenant",
		451: "Tenant already exists",
		452: "Main Tenant id is required!",
		453: "Main Tenant is not found!",
		454: "Unable to add tenant application",
		455: "Unable to add a new key to the tenant application",
		456: "Unable to add the tenant application ext Key",
		
		460: "Unable to find product",
		461: "Unable to find package",
		462: "You are not allowed to remove the tenant you are currently logged in with",
		463: "Invalid product code or package code provided",
		
		466: "You are not allowed to remove the product you are currently logged in with",
		467: "Package already exists",
		468: "Product already exists",
		
		470: "Unable to update product",
		471: "Unable to update tenant",
		472: "Unable to get the tenant application",
		473: "Unable to get the tenant application key",
		500: "You cannot modify or delete a locked record",
		501: "Environment record not found!",
		
		601: "Model not found",
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
			"key": {
				"source": ['body.key'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			"extKey": {
				"source": ['body.extKey'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			"appId": {
				"source": ['body.appId'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			'expDate': {
				"source": ['body.expDate'],
				"required": false,
				"validation": {
					"type": "string",
					"format": "date-time"
				}
			},
			'device': {
				"source": ['body.device'],
				"required": false,
				"validation": {
					"type": "object"
				}
			},
			'geo': {
				"source": ['body.geo'],
				"required": false,
				"validation": {
					"type": "object"
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
			"/tenant": {
				_apiInfo: {
					"l": "Get tenant",
					"group": "Tenant"
				}
			},
			"/admin/tenant": {
				_apiInfo: {
					"l": "Get tenant",
					"group": "Admin Tenant"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenants": {
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
			
			"/tenant": {
				_apiInfo: {
					"l": "Add Tenant",
					"group": "Tenant"
				},
				"commonFields": ['name', 'description'],
				"code": {
					"source": ['body.code'],
					"required": false,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"maxLength": 4
					}
				},
				"type": {
					"source": ['body.type'],
					"required": true,
					"default": "client",
					"validation": {
						"type": "string",
						"enum": ["product", "client"]
					}
				},
				"tag": {
					"source": ['body.tag'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"console": {
					"source": ['body.console'],
					"required": false,
					"validation": {
						"type": "boolean"
					}
				},
				"mainTenant": {
					"source": ['body.mainTenant'],
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
				"oauth": {
					"source": ['body.oauth'],
					"required": false,
					"validation": {
						"type": "object",
						"properties": {
							"secret": {
								"type": "string",
								"required": true
							},
							"redirectURI": {
								"type": "string",
								"required": true
							},
							"grants": {
								"type": "array",
								"required": true,
								"minItems": 1,
								"items": {
									"type": "string",
								}
							},
							"disabled": {
								"type": "integer",
								"required": true,
								"enum": [0, 1]
							},
							"type": {
								"type": "integer",
								"required": true,
								"enum": [1, 2]
							},
							"loginMode": {
								"type": "string",
								"required": true,
								"enum": ["urac", "oauth"]
							},
							"pin": {
								"type": "object",
								"required": false,
							}
						}
					}
				},
				"application": {
					"source": ['body.application'],
					"required": false,
					"validation": {
						"type": "object",
						"properties": {
							"description": {
								"type": "string",
								"required": false
							},
							"productCode": {
								"type": "string",
								"required": true
							},
							"packageCode": {
								"type": "string",
								"required": true
							},
							"_TTL": {
								"source": ['body._TTL'],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
								}
							},
							"appKey" : {
								"type": "object",
								"required": false,
								"properties": {
									"config": {
										"type": "object",
										"required": false
									},
									"extKey": {
										"type": "object",
										"required": false,
										"properties": {
											"label": {
												"type": "string",
												"required": true
											},
											"env": {
												"type": "string",
												"required": true
											},
											"expDate": {
												"type": "string",
												"required": false
											},
											"device": {
												"type": "object",
												"required": false
											},
											"geo": {
												"type": "object",
												"required": false
											}
										}
									}
								}
							},
							
						},
						"additionalProperties": false
					}
				}
			}
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
			"/tenant": {
				_apiInfo: {
					"l": "Delete Tenant",
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
					"source": ['query.code'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			}
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
			
			"/tenant": {
				_apiInfo: {
					"l": "Update tenant",
					"group": "Tenant"
				},
				"commonFields": ['description'],
				"tag": {
					"source": ['body.tag'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
			},
			
			"/admin/tenant": {
				_apiInfo: {
					"l": "Update tenant",
					"group": "Admin Tenant"
				},
				"commonFields": ['description'],
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['body.tag'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
			},
			
			"/tenant/profile": {
				_apiInfo: {
					"l": "Update profile",
					"group": "Tenant"
				},
				"profile": {
					"source": ['body.profile'],
					"required": true,
					"validation": {
						"type": "object"
					}
				},
			},
			
			"/admin/tenant/profile": {
				_apiInfo: {
					"l": "Update profile",
					"group": "Admin Tenant"
				},
				"profile": {
					"source": ['body.profile'],
					"required": true,
					"validation": {
						"type": "object"
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
			
			"/tenant/application": {
				_apiInfo: {
					"l": "Update tenant application",
					"group": "Tenant"
				},
				"commonFields": ['description'],
				"appId": {
					"source": ['body.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"_TTL": {
					"source": ['body._TTL'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			},
			
			"/admin/tenant/application": {
				_apiInfo: {
					"l": "Update tenant application",
					"group": "Admin Tenant"
				},
				"commonFields": ['description'],
				"id": {
					"source": ['query.true'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"appId": {
					"source": ['body.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"_TTL": {
					"source": ['body._TTL'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			},
			
			"/tenant/application/key": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Tenant"
				},
				"commonFields" : ["appId", "key"],
				"config": {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				}
			},
			
			"/admin/tenant/application/key": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Admin Tenant"
				},
				"commonFields" : ["appId", "key"],
				"id": {
					"source": ['query.true'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"config": {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				}
			},
			
			"/tenant/application/key/extKey": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Tenant"
				},
				"commonFields": ['appId', 'key', 'extKey', 'expDate', 'device', 'geo'],
				"label": {
					"source": ['body.label'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"extKeyEnv": {
					"source": ['body.extKeyEnv'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			},
			
			"/admin/tenant/application/key/extKey": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Admin Tenant"
				},
				"commonFields": ['appId', 'key', 'extKey', 'expDate', 'device', 'geo'],
				"id": {
					"source": ['query.true'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"label": {
					"source": ['body.label'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"extKeyEnv": {
					"source": ['body.extKeyEnv'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/applications/delete": {
				_apiInfo: {
					"l": "Delete Tenant",
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
					"source": ['query.code'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"appId": {
					"source": ['query.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/application/key/delete": {
				_apiInfo: {
					"l": "Delete Tenant",
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
					"source": ['query.code'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"appId": {
					"source": ['query.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"key": {
					"source": ['query.key'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/application/key/ext/delete": {
				_apiInfo: {
					"l": "Delete Tenant",
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
					"source": ['query.code'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"appId": {
					"source": ['query.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"key": {
					"source": ['query.key'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"extKey": {
					"source": ['query.key'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		}
	}
};