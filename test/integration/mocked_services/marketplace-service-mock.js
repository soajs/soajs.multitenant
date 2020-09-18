"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This service takes care of updates and upgrades as well as everything related to registry",
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": "1",
	"serviceName": "marketplace",
	"serviceGroup": "Console",
	"servicePort": 4007,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	"urac": true,
	
	"maintenance": {
		"readiness": "/heartbeat",
		"port": {"type": "maintenance"},
		"commands": [
			{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
			{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
		]
	},
	//-------------------------------------
	"errors": {
		400: "Business logic required data are missing",
	},
	"schema": {
		"commonFields": {
			"keywords": {
				"source": ['query.keywords', 'body.keywords'],
				"required": false,
				"validation": {"type": "string"}
			},
			"start": {
				"required": false,
				"source": ["query.start", "body.start"],
				"default": 0,
				"validation": {
					"type": "integer",
					"min": 0
				}
			},
			"limit": {
				"required": false,
				"source": ["query.limit", "body.limit"],
				"default": 100,
				"validation": {
					"type": "integer",
					"max": 2000
				}
			},
			"id": {
				"source": ['query.id', 'body.id'],
				"required": true,
				"validation": {"type": "string"}
			}
		},
		
		"get": {
			'/soajs/items': {
				"_apiInfo": {
					"l": "This API lists the items matching certain keywords from soajs catalog only.",
					"group": "SOAJS",
				},
				"commonFields": ["start", "limit", "keywords"],
				"types": {
					"source": ['query.types'],
					"required": false,
					"validation": {
						"type": "array",
						"minItems": 1,
						"items": {
							"type": "string"
						}
					}
				},
				"type": {
					"source": ['query.type'],
					"required": false,
					"validation": {"type": "string"}
				}
			},
			'/items/type/all': {
				"_apiInfo": {
					"l": "This API lists all items matching certain type with option to select a subtype including soajs items.",
					"group": "Internal"
				},
				"commonFields": ["start", "limit"],
				"type": {
					"source": ['query.type'],
					"required": false,
					"validation": {"type": "string"}
				},
				"subtype": {
					"source": ['query.subtype'],
					"required": false,
					"validation": {"type": "string"}
				},
				"types": {
					"source": ['query.types'],
					"required": false,
					"validation": {
						"type": "array",
						"minItems": 1,
						"items": {
							"type": "string"
						}
					}
				},
				"start": {
					"source": ['query.start'],
					"required": false,
					"validation": {"type": "integer"}
				},
				"limit": {
					"source": ['query.limit'],
					"required": false,
					"validation": {"type": "integer"}
				},
			},
		}
	}
};
let soajs_items = {
	records: [{
		_id: "5ec7326ef1e65b2db1b2a937",
		type: "service",
		name: "urac",
		configuration: {
			subType: "soajs",
			group: "Gateway",
		},
		metadata: {
			tags: [
				"users",
				"registration",
				"groups",
				"membership",
				"join"
			],
			attributes: {
				authentication: [
					"multitenant",
					"roaming",
					"invitation"
				],
				role: [
					"management",
					"acl"
				]
			},
			program: [
				"soajs"
			]
		},
		versions: [
			{
				version: "3",
				extKeyRequired: true,
				urac: true,
				urac_Profile: false,
				urac_ACL: false,
				urac_Config: false,
				urac_GroupConfig: false,
				tenant_Profile: false,
				provision_ACL: false,
				oauth: true,
				interConnect: null,
				maintenance: {
					readiness: "/heartbeat",
					port: {
						type: "maintenance"
					},
					commands: [
						{
							label: "Reload Registry",
							path: "/reloadRegistry",
							icon: "fas fa-undo"
						},
						{
							label: "Resource Info",
							path: "/resourceInfo",
							icon: "fas fa-info"
						}
					]
				},
				apis: [
					{
						l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
						v: "/password/forgot",
						m: "get",
						group: "My account guest"
					},
					{
						l: "To validate user account after joining",
						v: "/validate/join",
						m: "get",
						group: "Guest join"
					},
					{
						l: "Check if a username as (username or email) is available or taken",
						v: "/checkUsername",
						m: "get",
						group: "Guest join"
					},
					{
						l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
						v: "/emailToken",
						m: "get",
						group: "My account guest"
					},
					{
						l: "To validate change email",
						v: "/validate/changeEmail",
						m: "get",
						group: "My account guest"
					},
					{
						l: "Get user account information by username as (username or email)",
						v: "/user",
						m: "get",
						group: "My account",
						groupMain: true
					},
					{
						l: "Get user by id",
						v: "/admin/user",
						m: "get",
						group: "User administration"
					},
					{
						l: "List users matching certain keywords",
						v: "/admin/users",
						m: "get",
						group: "User administration",
						groupMain: true
					},
					{
						l: "Get users count matching certain keywords",
						v: "/admin/users/count",
						m: "get",
						group: "User administration"
					},
					{
						l: "List all groups",
						v: "/admin/groups",
						m: "get",
						group: "Group administration"
					},
					{
						l: "Get group by id or code",
						v: "/admin/group",
						m: "get",
						group: "Group administration"
					},
					{
						l: "Get all users and groups of a main tenant",
						v: "/admin/all",
						m: "get",
						group: "Administration"
					},
					{
						l: "Send custom email",
						v: "/email",
						m: "post",
						group: "Custom email"
					},
					{
						l: "Join and create an account",
						v: "/join",
						m: "post",
						group: "Guest join"
					},
					{
						l: "Add user",
						v: "/admin/user",
						m: "post",
						group: "User administration"
					},
					{
						l: "List users by Id",
						v: "/admin/users/ids",
						m: "post",
						group: "User administration",
						groupMain: true
					},
					{
						l: "Add group",
						v: "/admin/group",
						m: "post",
						group: "Group administration"
					},
					{
						l: "Delete group",
						v: "/admin/group",
						m: "delete",
						group: "Group administration"
					},
					{
						l: "Delete user",
						v: "/admin/user",
						m: "delete",
						group: "User administration"
					},
					{
						l: "Reset password",
						v: "/password/reset",
						m: "put",
						group: "My account guest"
					},
					{
						l: "Change account's password by id",
						v: "/account/password",
						m: "put",
						group: "My account"
					},
					{
						l: "Change account's email by id",
						v: "/account/email",
						m: "put",
						group: "My account"
					},
					{
						l: "Edit account's information by id",
						v: "/account",
						m: "put",
						group: "My account"
					},
					{
						l: "Edit user by id",
						v: "/admin/user",
						m: "put",
						group: "User administration"
					},
					{
						l: "Edit user's groups by id, username, or email",
						v: "/admin/user/groups",
						m: "put",
						group: "User administration"
					},
					{
						l: "Edit, reset, or delete user's pin information by id, username, or email",
						v: "/admin/user/pin",
						m: "put",
						group: "User administration"
					},
					{
						l: "Change the status of a user by id",
						v: "/admin/user/status",
						m: "put",
						group: "User administration"
					},
					{
						l: "Edit group by id",
						v: "/admin/group",
						m: "put",
						group: "Group administration"
					},
					{
						l: "Update environment(s) of group(s) by code(s) or id(s)",
						v: "/admin/groups/environments",
						m: "put",
						group: "Group administration"
					},
					{
						l: "Update package(s) of group(s) by code(s) or id(s)",
						v: "/admin/groups/packages",
						m: "put",
						group: "Group administration"
					},
					{
						l: "Self Invite user by id or username as username or email",
						v: "/admin/user/self/invite",
						m: "put",
						group: "User administration"
					},
					{
						l: "Invite users by id, username or email",
						v: "/admin/users/invite",
						m: "put",
						group: "User administration"
					},
					{
						l: "un-Invite users by id, username or email",
						v: "/admin/users/uninvite",
						m: "put",
						group: "User administration"
					}
				],
				branches: [
					"develop"
				]
			}
		],
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.urac"
		}
	}
	]
};

let all_items = {
	records: [{
		_id: "5ef23b834584f11f017b3def",
		type: "service",
		name: "multitenant",
		versions: [
			{
				version: "1",
				extKeyRequired: true,
				urac: false,
				urac_Profile: false,
				urac_ACL: false,
				urac_Config: false,
				urac_GroupConfig: false,
				tenant_Profile: false,
				provision_ACL: false,
				oauth: true,
				interConnect: [
					{
						name: "marketplace",
						version: "1"
					},
					{
						name: "console",
						version: "1"
					}
				],
				maintenance: {
					readiness: "/heartbeat",
					port: {
						type: "maintenance"
					},
					commands: [
						{
							label: "Reload Registry",
							path: "/reloadRegistry",
							icon: "fas fa-undo"
						},
						{
							label: "Resource Info",
							path: "/resourceInfo",
							icon: "fas fa-info"
						}
					]
				},
				apis: [
					{
						l: "List products",
						v: "/products",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "List console products",
						v: "/products/console",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Get product",
						v: "/product",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "Get console product",
						v: "/product/console",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "List product packages",
						v: "/product/packages",
						m: "get",
						group: "Product"
					},
					{
						l: "List console product packages",
						v: "/product/console/packages",
						m: "get",
						group: "Console product"
					},
					{
						l: "Get product package",
						v: "/product/package",
						m: "get",
						group: "Product"
					},
					{
						l: "Get console product package",
						v: "/product/console/package",
						m: "get",
						group: "Console product"
					},
					{
						l: "Get product ACL in raw form",
						v: "/product/acl/scope/raw",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "Get console product Acl in raw form",
						v: "/product/console/acl/scope/raw",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Get product package ACL in raw form",
						v: "/product/package/acl/raw",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "Get console product package ACL in raw form",
						v: "/product/console/package/acl/raw",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Get product Acl in UI form",
						v: "/product/acl/ui",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "Get console product Acl in UI form",
						v: "/product/console/acl/ui",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Get product package ACL in UI form",
						v: "/product/package/acl/ui",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "Get console product package ACL in UI form",
						v: "/product/console/package/acl/ui",
						m: "get",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Get the ACL of a specific service in the product package",
						v: "/product/package/acl/service",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific api in the product package",
						v: "/product/package/acl/api",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific service in the product scope",
						v: "/product/acl/scope/service",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific api in the product scope",
						v: "/product/acl/scope/api",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific service in the product package",
						v: "/product/console/package/acl/service",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific api in the product package",
						v: "/product/console/package/acl/api",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific service in the product scope",
						v: "/product/console/acl/scope/service",
						m: "get",
						group: "Product"
					},
					{
						l: "Get the ACL of a specific api in the product scope",
						v: "/product/console/acl/scope/api",
						m: "get",
						group: "Product"
					},
					{
						l: "List tenants",
						v: "/tenants",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List console tenants",
						v: "/tenants/console",
						m: "get",
						group: "Console tenant",
						groupMain: true
					},
					{
						l: "Get tenant",
						v: "/tenant",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Get admin tenant",
						v: "/admin/tenant",
						m: "get",
						group: "Admin Tenant"
					},
					{
						l: "Get console tenant",
						v: "/tenant/console",
						m: "get",
						group: "Console Tenant"
					},
					{
						l: "Get tenant application",
						v: "/tenant/application",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Get console tenant application",
						v: "/tenant/console/application",
						m: "get",
						group: "Console tenant"
					},
					{
						l: "Get tenant application",
						v: "/admin/tenant/application",
						m: "get",
						group: "Admin Tenant"
					},
					{
						l: "List tenant applications",
						v: "/tenant/applications",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List console tenant applications",
						v: "/tenant/console/applications",
						m: "get",
						group: "Console tenant"
					},
					{
						l: "List tenant applications",
						v: "/admin/tenant/applications",
						m: "get",
						group: "Admin Tenant"
					},
					{
						l: "List tenant application keys",
						v: "/tenant/application/key",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List console tenant application keys",
						v: "/tenant/console/application/key",
						m: "get",
						group: "Console tenant"
					},
					{
						l: "List tenant application keys",
						v: "/admin/tenant/application/key",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List tenant application ext keys",
						v: "/tenant/application/key/ext",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List console tenant application ext keys",
						v: "/tenant/console/application/key/ext",
						m: "get",
						group: "Console Tenant"
					},
					{
						l: "List tenant application ext keys",
						v: "/admin/tenant/application/key/ext",
						m: "get",
						group: "Admin Tenant"
					},
					{
						l: "List tenant application key configuration",
						v: "/tenant/application/key/config",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List tenant application key configuration",
						v: "/tenant/console/application/key/config",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List tenant application key configuration",
						v: "/admin/tenant/application/key/config",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Add product",
						v: "/product",
						m: "post",
						group: "Product",
						groupMain: true
					},
					{
						l: "Add console product",
						v: "/product/console",
						m: "post",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Add a package to product",
						v: "/product/package",
						m: "post",
						group: "Product"
					},
					{
						l: "Add a package to console product",
						v: "/product/console/package",
						m: "post",
						group: "Console product"
					},
					{
						l: "Add tenant with optional application, key, and ext key",
						v: "/tenant",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add console tenant with optional application, key, and ext key",
						v: "/tenant/console",
						m: "post",
						group: "Console tenant"
					},
					{
						l: "Add application to tenant with optional key and ext key",
						v: "/tenant/application",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add application to tenant with optional key and ext key",
						v: "/admin/tenant/application",
						m: "post",
						group: "Admin Tenant"
					},
					{
						l: "Add application to console tenant with optional key and ext key",
						v: "/tenant/console/application",
						m: "post",
						group: "Console tenant"
					},
					{
						l: "Add key to a tenant application with optional ext key",
						v: "/tenant/application/key",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add key to a tenant application with optional ext key",
						v: "/admin/tenant/application/key",
						m: "post",
						group: "Admin Tenant"
					},
					{
						l: "Add key to a console tenant application with optional ext key",
						v: "/tenant/console/application/key",
						m: "post",
						group: "Console tenant"
					},
					{
						l: "Add external key to tenant application",
						v: "/tenant/application/key/ext",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add external key to tenant application",
						v: "/admin/tenant/application/key/ext",
						m: "post",
						group: "Admin Tenant"
					},
					{
						l: "Add console external key to tenant application",
						v: "/tenant/console/application/key/ext",
						m: "post",
						group: "Console tenant"
					},
					{
						l: "Delete product",
						v: "/product",
						m: "delete",
						group: "Product",
						groupMain: true
					},
					{
						l: "Delete product package",
						v: "/product/package",
						m: "delete",
						group: "Product"
					},
					{
						l: "Delete console product",
						v: "/product/console",
						m: "delete",
						group: "Console product",
						groupMain: true
					},
					{
						l: "Delete console product package",
						v: "/product/console/package",
						m: "delete",
						group: " Console product"
					},
					{
						l: "Delete tenant",
						v: "/tenant",
						m: "delete",
						group: "Tenant"
					},
					{
						l: "Delete tenant application",
						v: "/tenant/application",
						m: "delete",
						group: "Tenant"
					},
					{
						l: "Delete tenant application key",
						v: "/tenant/application/key",
						m: "delete",
						group: "Tenant"
					},
					{
						l: "Delete tenant application external key",
						v: "/tenant/application/key/ext",
						m: "delete",
						group: "Tenant Access"
					},
					{
						l: "Delete console tenant",
						v: "/tenant/console",
						m: "delete",
						group: "Console tenant"
					},
					{
						l: "Delete console tenant application",
						v: "/tenant/console/application",
						m: "delete",
						group: "Console tenant"
					},
					{
						l: "Delete console tenant application key",
						v: "/tenant/console/application/key",
						m: "delete",
						group: "Console tenant"
					},
					{
						l: "Delete console tenant application external key",
						v: "/tenant/console/application/key/ext",
						m: "delete",
						group: "Console tenant"
					},
					{
						l: "Purge ACL for a product and all its packages",
						v: "/product/purge",
						m: "put",
						group: "Product"
					},
					{
						l: "Update product",
						v: "/product",
						m: "put",
						group: "Product"
					},
					{
						l: "Update console product",
						v: "/product/console",
						m: "put",
						group: "Console product"
					},
					{
						l: "Update product ACL scope",
						v: "/product/scope",
						m: "put",
						group: "Product"
					},
					{
						l: "Update console product ACL scope",
						v: "/product/console/scope",
						m: "put",
						group: "Console product"
					},
					{
						l: "Update product ACL scope by env",
						v: "/product/scope/env",
						m: "put",
						group: "Product"
					},
					{
						l: "Update console product ACL scope by env",
						v: "/product/console/scope/env",
						m: "put",
						group: "Console product"
					},
					{
						l: "Update product package",
						v: "/product/package",
						m: "put",
						group: "Product"
					},
					{
						l: "Update console product package",
						v: "/product/console/package",
						m: "put",
						group: "Console product"
					},
					{
						l: "Update product package ACL by env",
						v: "/product/package/acl/env",
						m: "put",
						group: "Product"
					},
					{
						l: "Update console product package",
						v: "/product/console/package/acl/env",
						m: "put",
						group: "Console product"
					},
					{
						l: "Update the ACL of a specific service in the product package",
						v: "/product/package/acl/service",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific api in the product package",
						v: "/product/package/acl/api",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific service in the product scope",
						v: "/product/acl/scope/service",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific api in the product scope",
						v: "/product/acl/scope/api",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific service in the product package",
						v: "/product/console/package/acl/service",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific api in the product package",
						v: "/product/console/package/acl/api",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific service in the product scope",
						v: "/product/console/acl/scope/service",
						m: "put",
						group: "Product"
					},
					{
						l: "Update the ACL of a specific api in the product scope",
						v: "/product/console/acl/scope/api",
						m: "put",
						group: "Product"
					},
					{
						l: "Update tenant",
						v: "/tenant",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update console tenant",
						v: "/tenant/console",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update tenant",
						v: "/admin/tenant",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update tenant profile",
						v: "/tenant/profile",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update tenant profile",
						v: "/tenant/console/profile",
						m: "put",
						group: "Console Tenant"
					},
					{
						l: "Update profile",
						v: "/admin/tenant/profile",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update tenant application",
						v: "/tenant/application",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update console tenant application",
						v: "/tenant/console/application",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update tenant application",
						v: "/admin/tenant/application",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update key information for a tenant application",
						v: "/tenant/application/key",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update key information for a console tenant application",
						v: "/tenant/console/application/key",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update key information for a tenant application",
						v: "/admin/tenant/application/key",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update external key information for a tenant application",
						v: "/tenant/application/key/ext",
						m: "put",
						group: "Tenant Access"
					},
					{
						l: "Update external key information for a console tenant application",
						v: "/tenant/console/application/key/ext",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update external key information for a tenant application",
						v: "/admin/tenant/application/key/ext",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update tenant application key configuration",
						v: "/tenant/application/key/config",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update console tenant application key configuration",
						v: "/tenant/console/application/key/config",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update tenant application key configuration",
						v: "/admin/tenant/application/key/config",
						m: "put",
						group: "Admin Tenant"
					},
					{
						l: "Update tenant oauth configuration",
						v: "/tenant/oauth",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update console tenant oauth configuration",
						v: "/tenant/console/oauth",
						m: "put",
						group: "Console tenant"
					},
					{
						l: "Update tenant oauth configuration",
						v: "/admin/tenant/oauth",
						m: "put",
						group: "Admin tenant"
					}
				],
			}
		],
		configuration: {
			subType: "soajs",
			group: "Console",
		},
		description: "This microservice is handling everything related to multitenancy and productization.",
		metadata: {
			tags: [
				"productization",
				"packaging"
			],
			attributes: {
				multitenant: [
					"main tenant",
					"sub tenant"
				],
				acl: [
					"by environment",
					"by tenant",
					"by key"
				]
			},
			program: [
				"soajs"
			]
		},
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.multitenant"
		}
	},
		{
			_id: "5f43f3ed2248e350f12c8a13",
			type: "service",
			name: "console",
			configuration: {
				subType: "soajs",
				group: "Console",
			},
			versions: [
				{
					version: "1",
					extKeyRequired: true,
					urac: true,
					urac_Profile: false,
					urac_ACL: false,
					urac_Config: false,
					urac_GroupConfig: false,
					tenant_Profile: false,
					provision_ACL: false,
					oauth: true,
					interConnect: [
						{
							name: "infra",
							version: "1"
						}
					],
					maintenance: {
						readiness: "/heartbeat",
						port: {
							type: "maintenance"
						},
						commands: [
							{
								label: "Reload Registry",
								path: "/reloadRegistry",
								icon: "fas fa-undo"
							},
							{
								label: "Resource Info",
								path: "/resourceInfo",
								icon: "fas fa-info"
							}
						]
					},
					apis: [
						{
							l: "This API returns all the ledger entries with the ability to filter entries by env, type and section",
							v: "/ledger",
							m: "get",
							group: "Ledger"
						},
						{
							l: "This API returns the environment(s).",
							v: "/environment",
							m: "get",
							group: "Environment"
						},
						{
							l: "This API returns the environment settings.",
							v: "/environment/settings",
							m: "get",
							group: "Environment"
						},
						{
							l: "This API returns the release information.",
							v: "/release",
							m: "get",
							group: "Settings"
						},
						{
							l: "This API returns the ui setting.",
							v: "/ui/setting",
							m: "get",
							group: "Settings"
						},
						{
							l: "This API gets a registry",
							v: "/registry",
							m: "get",
							group: "Registry"
						},
						{
							l: "This API gets a registry key",
							v: "/registry/key",
							m: "get",
							group: "Registry"
						},
						{
							l: "This API gets the throttling configuration",
							v: "/registry/throttling",
							m: "get",
							group: "Registry"
						},
						{
							l: "This API gets all custom registry",
							v: "/registry/custom",
							m: "get",
							group: "Registry"
						},
						{
							l: "This API gets all resource configuration",
							v: "/registry/resource",
							m: "get",
							group: "Registry"
						},
						{
							l: "This API gets a registry deployer information",
							v: "/registry/deployer",
							m: "get",
							group: "Registry"
						},
						{
							l: "List tenant oauth users",
							v: "/tenant/oauth/users",
							m: "get",
							group: "Oauth"
						},
						{
							l: "This API deletes an environment",
							v: "/environment",
							m: "delete",
							group: "Environment"
						},
						{
							l: "This API deletes the environment acl",
							v: "/environment/acl",
							m: "delete",
							group: "Environment"
						},
						{
							l: "This API deletes a custom DB",
							v: "/registry/db/custom",
							m: "delete",
							group: "Registry"
						},
						{
							l: "This API deletes the session DB",
							v: "/registry/db/session",
							m: "delete",
							group: "Registry"
						},
						{
							l: "This API deletes a custom registry",
							v: "/registry/custom",
							m: "delete",
							group: "Registry"
						},
						{
							l: "This API deletes the custom registry acl",
							v: "/registry/custom/acl",
							m: "delete",
							group: "Account"
						},
						{
							l: "This API deletes a resource configuration",
							v: "/registry/resource",
							m: "delete",
							group: "Registry"
						},
						{
							l: "This API deletes the resource configuration acl",
							v: "/registry/resource/acl",
							m: "delete",
							group: "Account"
						},
						{
							l: "Delete tenant oauth user",
							v: "/tenant/oauth/user",
							m: "delete",
							group: "Oauth"
						},
						{
							l: "This API adds an entry to the ledger of a specific type",
							v: "/ledger",
							m: "post",
							group: "Ledger"
						},
						{
							l: "This API adds an environment",
							v: "/environment",
							m: "post",
							group: "Environment"
						},
						{
							l: "This API adds a custom DB",
							v: "/registry/db/custom",
							m: "post",
							group: "Registry"
						},
						{
							l: "This API adds a custom registry",
							v: "/registry/custom",
							m: "post",
							group: "Registry"
						},
						{
							l: "This API adds a resource",
							v: "/registry/resource",
							m: "post",
							group: "Registry"
						},
						{
							l: "Add tenant oauth user",
							v: "/tenant/oauth/user",
							m: "post",
							group: "Oauth"
						},
						{
							l: "This API updates the environment acl",
							v: "/environment/acl",
							m: "put",
							group: "Environment"
						},
						{
							l: "This API updates the environment information",
							v: "/environment",
							m: "put",
							group: "Environment"
						},
						{
							l: "This API updates the registry db prefix",
							v: "/registry/db/prefix",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates the registry db session",
							v: "/registry/db/session",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates a registry",
							v: "/registry",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates throttling",
							v: "/registry/throttling",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates a custom registry",
							v: "/registry/custom",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates the custom registry acl",
							v: "/registry/custom/acl",
							m: "put",
							group: "Account"
						},
						{
							l: "This API updates a resource configuration",
							v: "/registry/resource",
							m: "put",
							group: "Registry"
						},
						{
							l: "This API updates the resource configuration acl",
							v: "/registry/resource/acl",
							m: "put",
							group: "Account"
						},
						{
							l: "Update tenant oauth user",
							v: "/tenant/oauth/user",
							m: "put",
							group: "Oauth"
						}
					],
				}
			],
			description: "This service takes care of updates and upgrades as well as everything related to registry",
			metadata: {
				tags: [
					"console",
					"environment",
					"registry",
					"ledger",
					"notification"
				],
				attributes: {
					environment: [
						"manual",
						"container"
					],
					registry: [
						"throttling",
						"custom",
						"database",
						"resource configuration"
					]
				},
				program: [
					"soajs"
				]
			},
			src: {
				provider: "github",
				owner: "soajs",
				repo: "soajs.console"
			}
		}
	]
};

config.packagejson = {};
const service = new soajs.server.service(config);

function run(serviceStartCb) {
	service.init(() => {
		service.get("/soajs/items", function (req, res) {
			return res.json(req.soajs.buildResponse(null, soajs_items));
		});
		service.get("/items/type/all", function (req, res) {
			return res.json(req.soajs.buildResponse(null, all_items));
		});
		service.start(serviceStartCb);
	});
}

function stop(serviceStopCb) {
	service.stop(serviceStopCb);
}

module.exports = {
	"runService": (serviceStartCb) => {
		if (serviceStartCb && typeof serviceStartCb === "function") {
			run(serviceStartCb);
		} else {
			run(null);
		}
	},
	"stopService": (serviceStopCb) => {
		if (serviceStopCb && typeof serviceStopCb === "function") {
			stop(serviceStopCb);
		} else {
			stop(null);
		}
	}
};
