/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

let aclSchema = require("./schemas/acl");
let updateAclSchema = require("./schemas/updateAcl");
let scopeSchema = require("./schemas/scope");
let updateScopeSchema = require("./schemas/updateScope");

module.exports = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This microservice is handling everything related to multitenancy and productization.",
	"prerequisites": {
		"cpu": '',
		"memory": ''
	},
	"serviceVersion": 1,
	"serviceName": "multitenant",
	"serviceGroup": "Console",
	"servicePort": 4004,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	"urac": true,
	"maintenance": {
		"readiness": "/heartbeat",
		"port": { "type": "maintenance" },
		"commands": [
			{ "label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo" },
			{ "label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info" }
		]
	},
	"interConnect": [
		{
			"name": "marketplace",
			"version": "1"
		},
		{
			"name": "console",
			"version": "1"
		}
	],

	"tags": ["productization", "packaging"],
	"attributes": {
		"multitenant": ["main tenant", "sub tenant"],
		"acl": ["by environment", "by tenant", "by key"]
	},
	"program": ["soajs"],
	"documentation": {
		"readme": "/README.md",
		"release": "/RELEASE.md"
	},

	//-------------------------------------
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
		457: "Unable to find application",
		459: "Unable to update the tenant OAuth, Server to server authentication is only supported with Oauth 2.0",
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

		480: "Unable to compare different acl environment types",
		500: "You cannot modify or delete a locked record",
		501: "Environment record not found!",
		502: "Unable to create External key",
		503: "Service Error",

		601: "Model not found",
		602: "Model error: ",

	},
	"schema": {
		"commonFields": {
			"acl": aclSchema,
			"description": {
				"source": ['body.description'],
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
				"source": ['query.id', 'body.id'],
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
				"source": ['body.key', 'query.key'],
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
				"source": ['body.appId', 'query.appId'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			'expDate': {
				"source": ['body.expDate'],
				"validation": {
					"type": "string",
					"format": "date-time"
				}
			},
			'device': {
				"source": ['body.device'],
				"validation": {
					"type": "object"
				}
			},
			'geo': {
				"source": ['body.geo'],
				"validation": {
					"type": "object"
				}
			},
			"start": {
				"source": ["query.start", "body.start"],
				"default": 0,
				"validation": {
					"type": "integer",
					"min": 0
				}
			},
			"limit": {
				"source": ["query.limit", "body.limit"],
				"default": 500,
				"validation": {
					"type": "integer",
					"max": 2000
				}
			},
			"keywords": {
				"source": ['query.keywords', 'body.keywords'],
				"validation": { "type": "string" }
			}
		},

		"get": {
			"/products": {
				_apiInfo: {
					"l": "List products",
					"group": "Product"
				}
			},
			"/product": {
				_apiInfo: {
					"l": "Get product",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ["query.code"],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				}
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
						"minLength": 4
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
			"/product/acl/scope/raw": {
				_apiInfo: {
					"l": "Get product ACL in raw form",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/package/acl/raw": {
				_apiInfo: {
					"l": "Get product package ACL in raw form",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"package": {
					"source": ['query.package'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/product/acl/ui": {
				_apiInfo: {
					"l": "Get product Acl in UI form",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/package/acl/ui": {
				_apiInfo: {
					"l": "Get product package ACL in UI form",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"package": {
					"source": ['query.package'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"config": {
					"source": ["query.config"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"envs": {
								"type": "array",
								"items": {
									"type": "string",
									"uniqueItems": true,
									"minItems": 1
								}
							},
							"type": {
								"type": "string",
								"enum": ["granular", "apiGroup"]
							}
						}
					}
				}
			},
			"/product/package/acl/service": {
				_apiInfo: {
					"l": "Get the ACL of a specific service in the product package",
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
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}

			},
			"/product/package/acl/api": {
				_apiInfo: {
					"l": "Get the ACL of a specific api in the product package",
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
						"minLength": 4
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}
			},
			"/product/acl/scope/service": {
				_apiInfo: {
					"l": "Get the ACL of a specific service in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}

			},
			"/product/acl/scope/api": {
				_apiInfo: {
					"l": "Get the ACL of a specific api in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}
			},

			"/products/console": {
				_apiInfo: {
					"l": "List console products",
					"group": "Console product"
				},
				"scope": {
					"source": ['query.scope'],
					"default": "all",
					"validation": {
						"type": "string",
						"enum": ["all", "other"]
					}
				}
			},
			"/product/console": {
				_apiInfo: {
					"l": "Get console product",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ["query.code"],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				}
			},
			"/product/console/packages": {
				_apiInfo: {
					"l": "List console product packages",
					"group": "Console product"
				},
				"commonFields": ['id']
			},
			"/product/console/package": {
				_apiInfo: {
					"l": "Get console product package",
					"group": "Console product"
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
						"minLength": 4
					}
				}
			},
			"/product/console/acl/scope/raw": {
				_apiInfo: {
					"l": "Get console product Acl in raw form",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/console/package/acl/raw": {
				_apiInfo: {
					"l": "Get console product package ACL in raw form",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"package": {
					"source": ['query.package'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/console/acl/ui": {
				_apiInfo: {
					"l": "Get console product Acl in UI form",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/console/package/acl/ui": {
				_apiInfo: {
					"l": "Get console product package ACL in UI form",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"package": {
					"source": ['query.package'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"config": {
					"source": ["query.config"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"envs": {
								"type": "array",
								"items": {
									"type": "string",
									"uniqueItems": true,
									"minItems": 1
								}
							},
							"type": {
								"type": "string",
								"enum": ["granular", "apiGroup"]
							}
						}
					}
				}
			},
			"/product/console/package/acl/service": {
				_apiInfo: {
					"l": "Get the ACL of a specific service in the product package",
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
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}

			},
			"/product/console/package/acl/api": {
				_apiInfo: {
					"l": "Get the ACL of a specific api in the product package",
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
						"minLength": 4
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}
			},
			"/product/console/acl/scope/service": {
				_apiInfo: {
					"l": "Get the ACL of a specific service in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}

			},
			"/product/console/acl/scope/api": {
				_apiInfo: {
					"l": "Get the ACL of a specific api in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"mainEnv": {
					"source": ["query.mainEnv"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"secEnv": {
					"source": ["query.secEnv"],
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ["query.page"],
					"validation": {
						"type": "integer",
						"minimum": 1
					}
				}
			},

			"/tenants/product/keys/ext": {
				_apiInfo: {
					"l": "Get ext keys of a product for certain tenants in a specific environment.",
					"group": "Tenant"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"env": {
					"source": ["query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ["query.profile"],
					"validation": {
						"type": "boolean"
					}
				},
				"tenants": {
					"source": ["query.tenants"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"tenant": {
								"type": "object",
								"properties": {
									"id": {
										"type": "string"
									},
									"code": {
										"type": "string"
									}
								},
								"required": ["code"]
							},
							"allowedTenants": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"tenant": {
											"type": "object",
											"properties": {
												"id": {
													"type": "string"
												},
												"code": {
													"type": "string"
												}
											},
											"required": ["code"]
										}
									}
								}
							}
						},
						"required": ["tenant"]
					}
				}
			},

			"/tenant/tenants": {
				_apiInfo: {
					"l": "List of the tenant sub tenants",
					"group": "Tenant"
				},
				"commonFields": ["start", "limit", "keywords"],
				"code": {
					"source": ['query.code'],
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
				"commonFields": ["start", "limit", "keywords"],
				"type": {
					"source": ['query.type'],
					"validation": {
						"type": "string",
						"enum": ["product", "client"]
					}
				},
				"category": {
					"source": ['query.category'],
					"validation": {
						"type": "string",
						"enum": ["tenant", "application", "integration"]
					}
				}
			},
			"/tenant": {
				_apiInfo: {
					"l": "Get tenant",
					"group": "Tenant"
				}
			},
			"/tenant/application": {
				_apiInfo: {
					"l": "Get tenant application",
					"group": "Tenant"
				},
				"appId": {
					"source": ['query.appId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}

			},
			"/tenant/applications": {
				_apiInfo: {
					"l": "List tenant applications",
					"group": "Tenant"
				},
			},
			"/tenant/application/key": {
				_apiInfo: {
					"l": "List tenant application keys",
					"group": "Tenant"
				},
				"commonFields": ['appId']
			},
			"/tenant/application/key/ext": {
				_apiInfo: {
					"l": "List tenant application ext keys",
					"group": "Tenant"
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
			"/tenant/application/key/config": {
				_apiInfo: {
					"l": "List tenant application key configuration",
					"group": "Tenant"
				},
				"commonFields": ['appId', 'key']
			},

			"/admin/tenant": {
				_apiInfo: {
					"l": "Get admin tenant",
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
			"/admin/tenant/name": {
				_apiInfo: {
					"l": "Get admin tenant by name",
					"group": "Admin Tenant"
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/admin/tenant/application": {
				_apiInfo: {
					"l": "Get tenant application",
					"group": "Admin Tenant"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
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
			"/admin/tenant/applications": {
				_apiInfo: {
					"l": "List tenant applications",
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
			"/admin/tenant/application/key": {
				_apiInfo: {
					"l": "List tenant application keys",
					"group": "Tenant"
				},
				"commonFields": ['id', 'appId']
			},
			"/admin/tenant/application/key/ext": {
				_apiInfo: {
					"l": "List tenant application ext keys",
					"group": "Admin Tenant"
				},
				"commonFields": ['id'],
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
			},
			"/admin/tenant/application/key/config": {
				_apiInfo: {
					"l": "List tenant application key configuration",
					"group": "Tenant"
				},
				"commonFields": ['id', 'appId', 'key']
			},

			"/tenants/console/product/keys/ext": {
				_apiInfo: {
					"l": "Get ext keys of a product for certain console tenants in a specific environment.",
					"group": "Console tenant"
				},
				"productCode": {
					"source": ["query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"env": {
					"source": ["query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ["query.profile"],
					"validation": {
						"type": "boolean"
					}
				},
				"tenants": {
					"source": ["query.tenants"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"tenant": {
								"type": "object",
								"properties": {
									"id": {
										"type": "string"
									},
									"code": {
										"type": "string"
									}
								},
								"required": ["code"]
							},
							"allowedTenants": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"tenant": {
											"type": "object",
											"properties": {
												"id": {
													"type": "string"
												},
												"code": {
													"type": "string"
												}
											},
											"required": ["code"]
										}
									}
								}
							}
						},
						"required": ["tenant"]
					}
				}
			},

			"/tenants/console": {
				_apiInfo: {
					"l": "List console tenants",
					"group": "Console tenant"
				},
				"commonFields": ["start", "limit", "keywords"],
				"scope": {
					"source": ['query.scope'],
					"default": "all",
					"validation": {
						"type": "string",
						"enum": ["all", "other"]
					}
				},
				"type": {
					"source": ['query.type'],
					"validation": {
						"type": "string",
						"enum": ["product", "client"]
					}
				},
				"category": {
					"source": ['query.category'],
					"validation": {
						"type": "string",
						"enum": ["tenant", "application", "integration"]
					}
				}
			},
			"/tenant/console": {
				_apiInfo: {
					"l": "Get console tenant",
					"group": "Console Tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/console/application": {
				_apiInfo: {
					"l": "Get console tenant application",
					"group": "Console tenant"
				},
				"appId": {
					"source": ['query.appId'],
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
			"/tenant/console/applications": {
				_apiInfo: {
					"l": "List console tenant applications",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/console/application/key": {
				_apiInfo: {
					"l": "List console tenant application keys",
					"group": "Console tenant"
				},
				"commonFields": ['id', 'appId']
			},
			"/tenant/console/application/key/ext": {
				_apiInfo: {
					"l": "List console tenant application ext keys",
					"group": "Console Tenant"
				},
				"commonFields": ['id'],
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
			"/tenant/console/application/key/config": {
				_apiInfo: {
					"l": "List tenant application key configuration",
					"group": "Tenant Application"
				},
				"commonFields": ['id', 'appId', 'key']
			}
		},

		"post": {
			"/product": {
				_apiInfo: {
					"l": "Add product",
					"group": "Product"
				},
				"commonFields": ['description', 'name'],
				"code": {
					"source": ['body.code'],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
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
					"l": "Add a package to product",
					"group": "Product"
				},
				"commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
				"code": {
					"source": ["body.code"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"tags": {
					"source": ['body.tags'],
					"validation": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					}
				},
				"type": {
					"source": ['body.type'],
					"validation": {
						"type": "object"
					}
				},
			},

			"/product/console": {
				_apiInfo: {
					"l": "Add console product",
					"group": "Console product"
				},
				"commonFields": ['description', 'name'],
				"code": {
					"source": ['body.code'],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
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
			"/product/console/package": {
				_apiInfo: {
					"l": "Add a package to console product",
					"group": "Console product"
				},
				"commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
				"code": {
					"source": ["body.code"],
					"required": true,
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
				"tags": {
					"source": ['body.tags'],
					"validation": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					}
				},
				"type": {
					"source": ['body.type'],
					"validation": {
						"type": "object"
					}
				},
			},

			"/tenant": {
				_apiInfo: {
					"l": "Add tenant with optional application, key, and ext key",
					"group": "Tenant"
				},
				"commonFields": ['name', 'description'],
				"code": {
					"source": ['body.code'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
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
					"validation": {
						"type": "string"
					}
				},
				"mainTenant": {
					"source": ['body.mainTenant'],
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ['body.profile'],
					"validation": {
						"type": "object"
					}
				},
				"oauth": {
					"source": ['body.oauth'],
					"validation": {
						"type": "object",
						"properties": {
							"secret": {
								"type": "string"
							},
							"redirectURI": {
								"type": "string"
							},
							"grants": {
								"type": "array",
								"minItems": 1,
								"items": {
									"type": "string",
								}
							},
							"disabled": {
								"type": "integer",
								"enum": [0, 1]
							},
							"type": {
								"type": "integer",
								"enum": [1, 2]
							},
							"loginMode": {
								"type": "string",
								"enum": ["urac", "oauth"]
							},
							"pin": {
								"type": "object"
							}
						},
						"required": ["secret", "disabled", "type", "loginMode"]
					}
				},
				"application": {
					"source": ['body.application'],
					"validation": {
						"type": "object",
						"properties": {
							"description": {
								"type": "string"
							},
							"productCode": {
								"type": "string",
								"format": "alphanumeric",
								"minLength": 4
							},
							"packageCode": {
								"type": "string",
								"format": "alphanumeric",
								"minLength": 4
							},
							"_TTL": {
								"type": "string",
								"enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
							},
							"appKey": {
								"type": "object",
								"properties": {
									"config": {
										"type": "object"
									},
									"extKey": {
										"type": "object",
										"properties": {
											"label": {
												"type": "string"
											},
											"env": {
												"type": "string"
											},
											"expDate": {
												"type": "string",
												"format": "date-time"
											},
											"device": {
												"type": "object"
											},
											"geo": {
												"type": "object"
											}
										},
										"required": ["label", "env"]
									}
								}
							},
						},
						"additionalProperties": false,
						"required": ["productCode", "packageCode"]
					}
				}
			},
			"/tenant/application": {
				_apiInfo: {
					"l": "Add application to tenant with optional key and ext key",
					"group": "Tenant"
				},
				"description": {
					"source": ['body.description'],
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ['body.productCode'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					},
					"required": true
				},
				"packageCode": {
					"source": ['body.packageCode'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					},
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
				"appKey": {
					"source": ['body.appKey'],
					"validation": {
						"type": "object",
						"properties": {
							"config": {
								"type": "object"
							},
							"extKey": {
								"type": "object",
								"properties": {
									"label": {
										"type": "string"
									},
									"env": {
										"type": "string"
									},
									"expDate": {
										"type": "string",
										"format": "date-time"
									},
									"device": {
										"type": "object"
									},
									"geo": {
										"type": "object"
									}
								},
								"required": ["label", "env"]
							}
						}
					}
				}
			},
			"/tenant/application/key": {
				_apiInfo: {
					"l": "Add key to a tenant application with optional ext key",
					"group": "Tenant"
				},
				"commonFields": ['appId'],
				"config": {
					"source": ['body.config'],
					"validation": {
						"type": "object",
					}
				},
				"extKey": {
					"source": ['body.extKey'],
					"validation": {
						"type": "object",
						"properties": {
							"label": {
								"type": "string"
							},
							"env": {
								"type": "string"
							},
							"expDate": {
								"type": "string",
								"format": "date-time"
							},
							"device": {
								"type": "object"
							},
							"geo": {
								"type": "object"
							}
						},
						"required": ["label", "env"]
					}
				}
			},
			"/tenant/application/key/ext": {
				_apiInfo: {
					"l": "Add external key to tenant application",
					"group": "Tenant"
				},
				"commonFields": ['appId', 'key', "expDate", "device", "geo"],
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string",
					},
					"required": true
				},
				"env": {
					"source": ['body.env'],
					"validation": {
						"type": "string",
					},
					"required": true
				}
			},

			"/admin/tenant/application": {
				_apiInfo: {
					"l": "Add application to tenant with optional key and ext key",
					"group": "Admin Tenant"
				},
				"id": {
					"source": ['query.id', 'body.id'],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"description": {
					"source": ['body.description'],
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ['body.productCode'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					},
					"required": true
				},
				"packageCode": {
					"source": ['body.packageCode'],
					"validation": {
						"type": "string",
						"minLength": 4
					},
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
				"appKey": {
					"source": ['body.appKey'],
					"validation": {
						"type": "object",
						"properties": {
							"config": {
								"type": "object"
							},
							"extKey": {
								"type": "object",
								"properties": {
									"label": {
										"type": "string"
									},
									"env": {
										"type": "string"
									},
									"expDate": {
										"type": "string",
										"format": "date-time"
									},
									"device": {
										"type": "object"
									},
									"geo": {
										"type": "object"
									}
								},
								"required": ["label", "env"]
							}
						}
					}
				}
			},
			"/admin/tenant/application/key": {
				_apiInfo: {
					"l": "Add key to a tenant application with optional ext key",
					"group": "Admin Tenant"
				},
				"commonFields": ['appId'],
				"id": {
					"source": ['query.id', "body.id"],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"config": {
					"source": ['body.config'],
					"validation": {
						"type": "object",
					}
				},
				"extKey": {
					"source": ['body.extKey'],
					"validation": {
						"type": "object",
						"properties": {
							"label": {
								"type": "string"
							},
							"env": {
								"type": "string"
							},
							"expDate": {
								"type": "string",
								"format": "date-time"
							},
							"device": {
								"type": "object"
							},
							"geo": {
								"type": "object"
							}
						},
						"required": ["label", "env"]
					}
				}
			},
			"/admin/tenant/application/key/ext": {
				_apiInfo: {
					"l": "Add external key to tenant application",
					"group": "Admin Tenant"
				},
				"id": {
					"source": ['query.id', "body.id"],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"commonFields": ['appId', 'key', "expDate", "device", "geo"],
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string",
					},
					"required": true
				},
				"env": {
					"source": ['body.env'],
					"validation": {
						"type": "string",
					},
					"required": true
				}
			},

			"/tenant/console": {
				_apiInfo: {
					"l": "Add console tenant with optional application, key, and ext key",
					"group": "Console tenant"
				},
				"commonFields": ['name', 'description'],
				"code": {
					"source": ['body.code'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
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
					"validation": {
						"type": "string"
					}
				},
				"mainTenant": {
					"source": ['body.mainTenant'],
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ['body.profile'],
					"validation": {
						"type": "object"
					}
				},
				"oauth": {
					"source": ['body.oauth'],
					"validation": {
						"type": "object",
						"properties": {
							"secret": {
								"type": "string"
							},
							"redirectURI": {
								"type": "string",
							},
							"grants": {
								"type": "array",
								"minItems": 1,
								"items": {
									"type": "string",
								}
							},
							"disabled": {
								"type": "integer",
								"enum": [0, 1]
							},
							"type": {
								"type": "integer",
								"enum": [1, 2]
							},
							"loginMode": {
								"type": "string",
								"enum": ["urac", "oauth"]
							},
							"pin": {
								"type": "object"
							}
						},
						"required": ["loginMode", "type", "disabled", "secret"]
					}
				},
				"application": {
					"source": ['body.application'],
					"validation": {
						"type": "object",
						"properties": {
							"description": {
								"type": "string"
							},
							"productCode": {
								"type": "string",
								"format": "alphanumeric",
								"minLength": 4
							},
							"packageCode": {
								"type": "string",
								"format": "alphanumeric",
								"minLength": 4
							},
							"_TTL": {
								"type": "string",
								"enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
							},
							"appKey": {
								"type": "object",
								"properties": {
									"config": {
										"type": "object"
									},
									"extKey": {
										"type": "object",
										"properties": {
											"label": {
												"type": "string"
											},
											"env": {
												"type": "string"
											},
											"expDate": {
												"type": "string",
												"format": "date-time"
											},
											"device": {
												"type": "object"
											},
											"geo": {
												"type": "object"
											}
										},
										"required": ["label", "env"]
									}
								}
							},
						},
						"additionalProperties": false,
						"required": ["productCode", "packageCode"]
					}
				}
			},
			"/tenant/console/application": {
				_apiInfo: {
					"l": "Add application to console tenant with optional key and ext key",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id', 'body.id'],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"description": {
					"source": ['body.description'],
					"validation": {
						"type": "string"
					},
				},
				"productCode": {
					"source": ['body.productCode'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					},
					"required": true
				},
				"packageCode": {
					"source": ['body.packageCode'],
					"validation": {
						"type": "string",
						"minLength": 4
					},
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
				"appKey": {
					"source": ['body.appKey'],
					"validation": {
						"type": "object",
						"properties": {
							"config": {
								"type": "object"
							},
							"extKey": {
								"type": "object",
								"properties": {
									"label": {
										"type": "string"
									},
									"env": {
										"type": "string"
									},
									"expDate": {
										"type": "string",
										"format": "date-time"
									},
									"device": {
										"type": "object"
									},
									"geo": {
										"type": "object"
									}
								},
								"required": ["label", "env"]
							}
						}
					}
				}
			},
			"/tenant/console/application/key": {
				_apiInfo: {
					"l": "Add key to a console tenant application with optional ext key",
					"group": "Console tenant"
				},
				"commonFields": ['appId'],
				"id": {
					"source": ['query.id', "body.id"],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"config": {
					"source": ['body.config'],
					"validation": {
						"type": "object",
					}
				},
				"extKey": {
					"source": ['body.extKey'],
					"validation": {
						"type": "object",
						"properties": {
							"label": {
								"type": "string"
							},
							"env": {
								"type": "string"
							},
							"expDate": {
								"type": "string",
								"format": "date-time"
							},
							"device": {
								"type": "object"
							},
							"geo": {
								"type": "object"
							}
						},
						"required": ["label", "env"]
					}
				}
			},
			"/tenant/console/application/key/ext": {
				_apiInfo: {
					"l": "Add console external key to tenant application",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id', "body.id"],
					"validation": {
						"type": "string"
					},
					"required": true
				},
				"commonFields": ['appId', 'key', "expDate", "device", "geo"],
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string",
					},
					"required": true
				},
				"env": {
					"source": ['body.env'],
					"validation": {
						"type": "string",
					},
					"required": true
				}
			}
		},

		"delete": {
			"/product": {//
				_apiInfo: {
					"l": "Delete product",
					"group": "Product"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/package": {//
				_apiInfo: {
					"l": "Delete product package",
					"group": "Product"
				},
				"commonFields": ['id'],
				"code": {
					"source": ['query.code'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"soajs": {
					"source": ["query.soajs"],
					"validation": {
						"type": "boolean"
					}
				},
			},

			"/product/console": {//
				_apiInfo: {
					"l": "Delete console product",
					"group": "Console product"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/console/package": {//
				_apiInfo: {
					"l": "Delete console product package",
					"group": " Console product"
				},
				"commonFields": ['id'],
				"code": {
					"source": ['query.code'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},

			"/tenants": {
				_apiInfo: {
					"l": "Delete tenants",
					"group": "Tenant"
				},
				"ids": {
					"source": ['query.ids'],
					"validation": {
						"type": "array",
						"minItems": 1,
						"items": {
							"type": "string",
							"pattern": `^[a-f\\d]{24}$`,
							"errorMessage": {
								"pattern": "Tenant Id provided is not valid."
							}
						}
					}
				}
			},
			"/tenant": {
				_apiInfo: {
					"l": "Delete tenant",
					"group": "Tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/application": {
				_apiInfo: {
					"l": "Delete tenant application",
					"group": "Tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
			"/tenant/application/key": {
				_apiInfo: {
					"l": "Delete tenant application key",
					"group": "Tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
			"/tenant/application/key/ext": {
				_apiInfo: {
					"l": "Delete tenant application external key",
					"group": "Tenant Access"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
					"source": ['query.extKey'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},

			"/tenant/console": {
				_apiInfo: {
					"l": "Delete console tenant",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/console/application": {
				_apiInfo: {
					"l": "Delete console tenant application",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
			"/tenant/console/application/key": {
				_apiInfo: {
					"l": "Delete console tenant application key",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
			"/tenant/console/application/key/ext": {
				_apiInfo: {
					"l": "Delete console tenant application external key",
					"group": "Console tenant"
				},
				"id": {
					"source": ['query.id'],
					"validation": {
						"type": "string"
					}
				},
				"code": {
					"source": ['query.code'],
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
					"source": ['query.extKey'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		},

		"put": {
			"/product/purge": {
				_apiInfo: {
					"l": "Purge ACL for a product and all its packages",
					"group": "Product"
				},
				"commonFields": ['id']
			},
			"/product": {//
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
			"/product/scope/env": {
				_apiInfo: {
					"l": "Update product ACL scope by env",
					"group": "Product"
				},
				"commonFields": ['id'],
				"acl": {
					'source': ['body.acl'],
					'required': true,
					'validation': {
						"type": "object",
						"properties": {
							"acl": updateScopeSchema
						}
					}
				},
				"env": {
					"required": true,
					"source": ["query.env"],
					"validation": {
						"type": "string"
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
						"type": "string"
					}
				},
				"soajs": {
					"source": ["query.soajs"],
					"validation": {
						"type": "boolean"
					}
				},
				"_TTL": {
					"source": ['body._TTL'],
					"validation": {
						"type": "string",
						"enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
					}
				},
				"tags": {
					"source": ['body.tags'],
					"validation": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					}
				},
				"type": {
					"source": ["body.type"],
					"validation": {
						"type": "object"
					}
				}
			},
			"/product/package/acl/env": {
				_apiInfo: {
					"l": "Update product package ACL by env",
					"group": "Product"
				},
				"commonFields": ['id'],
				"code": {
					"source": ["query.code", "body.code"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"type": {
					"source": ["query.type", "body.type"],
					"validation": {
						"type": "string",
						"enum": ["granular"]
					}
				},
				"env": {
					"source": ["query.env", "body.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					'source': ['body.acl'],
					'required': true,
					"validation": updateAclSchema
				}
			},
			"/product/package/acl/service": {
				_apiInfo: {
					"l": "Update the ACL of a specific service in the product package",
					"group": "Product"
				},
				"packageCode": {
					"source": ["body.packageCode", "query.packageCode"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/package/acl/api": {
				_apiInfo: {
					"l": "Update the ACL of a specific api in the product package",
					"group": "Product"
				},
				"packageCode": {
					"source": ["body.packageCode", "query.packageCode"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/acl/scope/service": {
				_apiInfo: {
					"l": "Update the ACL of a specific service in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/acl/scope/api": {
				_apiInfo: {
					"l": "Update the ACL of a specific api in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},

			"/product/console": {//
				_apiInfo: {
					"l": "Update console product",
					"group": "Console product"
				},
				"commonFields": ['id', 'name', 'description']
			},
			"/product/console/scope": {
				_apiInfo: {
					"l": "Update console product ACL scope",
					"group": "Console product"
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
			"/product/console/scope/env": {
				_apiInfo: {
					"l": "Update console product ACL scope by env",
					"group": "Console product"
				},
				"commonFields": ['id'],
				"acl": {
					'source': ['body.acl'],
					'required': true,
					'validation': {
						"type": "object",
						"properties": {
							"acl": updateScopeSchema
						}
					}
				},
				"env": {
					"required": true,
					"source": ["query.env"],
					"validation": {
						"type": "string"
					}
				}
			},
			"/product/console/package": {
				_apiInfo: {
					"l": "Update console product package",
					"group": "Console product"
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
						"type": "string"
					}
				},
				"soajs": {
					"source": ["query.soajs"],
					"validation": {
						"type": "boolean"
					}
				},
				"_TTL": {
					"source": ['body._TTL'],
					"validation": {
						"type": "string",
						"enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
					}
				},
				"tags": {
					"source": ['body.tags'],
					"validation": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					}
				},
				"type": {
					"source": ["body.type"],
					"validation": {
						"type": "object"
					}
				}
			},
			"/product/console/package/acl/env": {
				_apiInfo: {
					"l": "Update console product package",
					"group": "Console product"
				},
				"commonFields": ['id'],
				"code": {
					"source": ["query.code"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"type": {
					"source": ["query.type"],
					"validation": {
						"type": "string",
						"enum": ["granular"]
					}
				},
				"env": {
					"source": ["query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					'source': ['body.acl'],
					'required': true,
					"validation": updateAclSchema
				}
			},
			"/product/console/package/acl/service": {
				_apiInfo: {
					"l": "Update the ACL of a specific service in the product package",
					"group": "Product"
				},
				"packageCode": {
					"source": ["body.packageCode", "query.packageCode"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/console/package/acl/api": {
				_apiInfo: {
					"l": "Update the ACL of a specific api in the product package",
					"group": "Product"
				},
				"packageCode": {
					"source": ["body.packageCode", "query.packageCode"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/console/acl/scope/service": {
				_apiInfo: {
					"l": "Update the ACL of a specific service in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
					}
				}
			},
			"/product/console/acl/scope/api": {
				_apiInfo: {
					"l": "Update the ACL of a specific api in the product scope",
					"group": "Product"
				},
				"productCode": {
					"source": ["body.productCode", "query.productCode"],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"acl": {
					"source": ["body.acl"],
					"required": true,
					"validation": {
						"type": "array"
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
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name'],
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ['body.profile'],
					"validation": {
						"type": "object"
					}
				},
				"category": {
					"source": ['body.category'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/profile": {
				_apiInfo: {
					"l": "Update tenant profile",
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
			"/tenant/application": {
				_apiInfo: {
					"l": "Update tenant application",
					"group": "Tenant"
				},
				"commonFields": ['description', 'appId'],
				"_TTL": {
					"source": ['body._TTL'],
					"validation": {
						"type": "string"
					}
				},
				"packageCode": {
					"source": ['body.packageCode'],
					"validation": {
						"type": "string",
						"minLength": 4
					}
				},
			},
			"/tenant/application/key": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Tenant"
				},
				"commonFields": ["appId", "key"],
				"config": {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				}
			},
			"/tenant/application/key/ext": {
				_apiInfo: {
					"l": "Update external key information for a tenant application",
					"group": "Tenant Access"
				},
				"commonFields": ['appId', 'key', 'extKey', 'expDate', 'device', 'geo'],
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string"
					}
				},
				"extKeyEnv": {
					"source": ['body.extKeyEnv'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/application/key/config": {
				_apiInfo: {
					"l": "Update tenant application key configuration",
					"group": "Tenant Application"
				},
				"commonFields": ['appId', 'key'],
				'envCode': {
					'source': ['body.envCode'],
					'required': true,
					'validation': {
						'type': 'string'
					}
				},
				'config': {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				},
			},
			"/tenant/oauth": {
				_apiInfo: {
					"l": "Update tenant oauth configuration",
					"group": "Tenant"
				},
				"type": {
					"source": ['body.type'],
					"validation": {
						"type": "number",
						"enum": [0, 2]
					}
				},
				"oauthType": {
					"source": ['body.oauthType'],
					"validation": {
						"type": "string",
						"enum": ["urac", "miniurac", "off"]
					}
				},
				"pin": {
					"source": ['body.pin'],
					"validation": {
						"type": "object"
					}
				},
				"secret": {
					"source": ['body.secret'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"redirectURI": {
					"source": ['body.redirectURI'],
					"validation": {
						"type": "string",
						"format": "uri"
					}
				}
			},

			"/admin/tenant": {
				_apiInfo: {
					"l": "Update tenant",
					"group": "Admin Tenant"
				},
				"commonFields": ['description'],
				"id": {
					"source": ['query.id', 'body.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['body.tag'],
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name'],
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ['body.profile'],
					"validation": {
						"type": "object"
					}
				},
				"category": {
					"source": ['body.category'],
					"validation": {
						"type": "string"
					}
				}
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
			"/admin/tenant/application": {
				_apiInfo: {
					"l": "Update tenant application",
					"group": "Admin Tenant"
				},
				"commonFields": ['description', 'appId'],
				"id": {
					"source": ['query.id', "body.id"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"_TTL": {
					"source": ['body._TTL'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/admin/tenant/application/key": {
				_apiInfo: {
					"l": "Update key information for a tenant application",
					"group": "Admin Tenant"
				},
				"commonFields": ["appId", "key"],
				"id": {
					"source": ['query.id'],
					"required": true,
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
			"/admin/tenant/application/key/ext": {
				_apiInfo: {
					"l": "Update external key information for a tenant application",
					"group": "Admin Tenant"
				},
				"commonFields": ['appId', 'key', 'extKey', 'expDate', 'device', 'geo'],
				"id": {
					"source": ['query.id', "body.id"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string"
					}
				},
				"extKeyEnv": {
					"source": ['body.extKeyEnv'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/admin/tenant/application/key/config": {
				_apiInfo: {
					"l": "Update tenant application key configuration",
					"group": "Admin Tenant"
				},
				"commonFields": ['id', 'appId', 'key'],
				'envCode': {
					'source': ['body.envCode'],
					'required': true,
					'validation': {
						'type': 'string'
					}
				},
				'config': {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				},
			},
			"/admin/tenant/oauth": {
				_apiInfo: {
					"l": "Update tenant oauth configuration",
					"group": "Admin tenant"
				},
				"commonFields": ['id'],
				"type": {
					"source": ['body.type'],
					"validation": {
						"type": "number",
						"enum": [0, 2]
					}
				},
				"oauthType": {
					"source": ['body.oauthType'],
					"validation": {
						"type": "string",
						"enum": ["urac", "miniurac", "oauth", "off"]
					}
				},
				"pin": {
					"source": ['body.pin'],
					"validation": {
						"type": "object"
					}
				},
				"secret": {
					"source": ['body.secret'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"redirectURI": {
					"source": ['body.redirectURI'],
					"validation": {
						"type": "string",
						"format": "uri"
					}
				}
			},

			"/tenant/console": {
				_apiInfo: {
					"l": "Update console tenant",
					"group": "Console tenant"
				},
				"commonFields": ['description'],
				"id": {
					"source": ['query.id', 'body.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['body.tag'],
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name'],
					"validation": {
						"type": "string"
					}
				},
				"profile": {
					"source": ['body.profile'],
					"validation": {
						"type": "object"
					}
				},
				"category": {
					"source": ['body.category'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/console/profile": {
				_apiInfo: {
					"l": "Update tenant profile",
					"group": "Console Tenant"
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
			"/tenant/console/application": {
				_apiInfo: {
					"l": "Update console tenant application",
					"group": "Console tenant"
				},
				"commonFields": ['description', 'appId'],
				"_TTL": {
					"source": ['body._TTL'],
					"validation": {
						"type": "string"
					}
				},
				"id": {
					"source": ['query.id', "body.id"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"packageCode": {
					"source": ['body.packageCode'],
					"validation": {
						"type": "string",
						"format": "alphanumeric",
						"minLength": 4
					}
				},
			},
			"/tenant/console/application/key": {
				_apiInfo: {
					"l": "Update key information for a console tenant application",
					"group": "Console tenant"
				},
				"commonFields": ["appId", "key"],
				"id": {
					"source": ['query.id'],
					"required": true,
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
			"/tenant/console/application/key/ext": {
				_apiInfo: {
					"l": "Update external key information for a console tenant application",
					"group": "Console tenant"
				},
				"commonFields": ['appId', 'key', 'extKey', 'expDate', 'device', 'geo'],
				"label": {
					"source": ['body.label'],
					"validation": {
						"type": "string"
					}
				},
				"id": {
					"source": ['query.id', "body.id"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"extKeyEnv": {
					"source": ['body.extKeyEnv'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/tenant/console/application/key/config": {
				_apiInfo: {
					"l": "Update console tenant application key configuration",
					"group": "Console tenant"
				},
				"commonFields": ['id', 'appId', 'key'],
				'envCode': {
					'source': ['body.envCode'],
					'required': true,
					'validation': {
						'type': 'string'
					}
				},
				'config': {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object"
					}
				},
			},
			"/tenant/console/oauth": {
				_apiInfo: {
					"l": "Update console tenant oauth configuration",
					"group": "Console tenant"
				},
				"commonFields": ['id'],
				"type": {
					"source": ['body.type'],
					"validation": {
						"type": "number",
						"enum": [0, 2]
					}
				},
				"oauthType": {
					"source": ['body.oauthType'],
					"validation": {
						"type": "string",
						"enum": ["urac", "miniurac", "off"]
					}
				},
				"pin": {
					"source": ['body.pin'],
					"validation": {
						"type": "object"
					}
				},
				"secret": {
					"source": ['body.secret'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"redirectURI": {
					"source": ['body.redirectURI'],
					"validation": {
						"type": "string",
						"format": "uri"
					}
				},
				'availableEnv': {
					'source': ['body.availableEnv'],
					'required': true,
					'validation': {
						'type': 'array',
						'items': { 'type': 'string' }
					}
				},
			}
		}
	}
};
