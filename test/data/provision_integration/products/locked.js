'use strict';

let lib = {
	"_id": "5512867be603d7e01ab1688d",
	"code": "DSBRD",
	"name": "Console UI Product",
	"description": "This is the main Console UI Product.",
	"console": true,
	"scope": {
		"acl": {
			"dashboard": {
				"multitenant": {
					"1": {
						"access": true,
						"get": [
							{
								"apis": {
									"/product": {
										"access": true
									}
								},
								"group": "Product"
							},
							{
								"apis": {
									"/tenants/console": {
										"access": true
									}
								},
								"group": "Tenant"
							},
							{
								"apis": {
									"/products/console": {
										"access": true
									}
								},
								"group": "Console product"
							}
						]
					}
				},
				"console": {
					"1": {
						"access": true
					}
				},
			}
		}
	},
	"packages": [
		{
			"code": "DSBRD_GUEST",
			"name": "Guest",
			"description": "This package is used to provide anyone access to login and forgot password. Once logged in the package linked to the user tenant will take over thus providing the right access to the logged in user.",
			"acl": {
				"dashboard": {
					"multitenant": [
						{
							"version": "1",
							"get": [
								"Product",
								"Console product",
								"Tenant"
							],
							"post": [
								"Product",
								"Tenant"
							],
							"delete": [
								"Product",
								"Tenant"
							],
							"put":[
								"Product",
								"Tenant"
							]
						}
					],
					"console" : [{
						"version": "1",
					}]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_OWNER",
			"name": "Owner",
			"description": "This package is used to provide owner level access. This means the user who has this package will have access to everything.",
			"acl": {
				"dashboard": {
					"multitenant": [
						{
							"version": "1",
							"get": [
								"Product",
								"Console product",
								"Tenant"
							],
							"post": [
								"Product",
								"Tenant"
							],
							"delete": [
								"Product",
								"Tenant"
							],
							"put":[
								"Product",
								"Tenant"
							]
						}
					],
					"console" : [{
						"version": "1",
					}]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_DEVOP",
			"name": "DevOps",
			"description": "This package has the right privileges a DevOps user will need to be able to configure, control, and monitor what is happening across the board.",
			"acl": {
				"dashboard": {
					"oauth": [
						{
							"version": "1",
							"delete": [
								"Tokenization",
								"User Tokenization",
								"Cient Tokenization"
							],
							"post": [
								"Tokenization",
								"Guest"
							],
							"get": [
								"Guest"
							]
						}
					],
					"urac": [
						{
							"version": "2",
							"get": [
								"Guest Email Account Settings",
								"Tenant",
								"My Account",
								"Guest Password Settings",
								"Guest Email Validation"
							],
							"post": [
								"My Account",
								"Guest Password Settings"
							]
						}
					],
					"multitenant": [
						{
							"version": "1",
							"get": [
								"Product",
								"Console product",
								"Tenant"
							],
							"post": [
								"Product",
								"Tenant"
							],
							"delete": [
								"Product",
								"Tenant"
							],
							"put":[
								"Product",
								"Tenant"
							]
						}
					],
					"dashboard": [
						{
							"version": "1",
							"get": [
								"Continuous Delivery",
								"Environment",
								"Templates",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Tenant Settings",
								"Services",
								"Daemons",
								"Hosts",
								"HA Cloud",
								"Catalog",
								"Git Accounts",
								"API Builder",
								"Secrets",
								"Dashboard Tenants",
								"Product",
								"Tenant",
								"Tenant oAuth",
								"Tenant Application"
							],
							"post": [
								"Continuous Delivery",
								"Environment",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Tenant Settings",
								"Services",
								"Daemons",
								"Hosts",
								"HA Cloud",
								"Catalog",
								"Git Accounts",
								"API Builder",
								"Secrets",
								"Product",
								"Tenant",
								"Tenant oAuth",
								"Tenant Application",
								"swagger",
								"Simulate",
								"Continuous Delivery Deployment",
								"Private Tenant ACL"
							],
							"put": [
								"Continuous Delivery",
								"Environment",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Tenant Settings",
								"Services",
								"HA Cloud",
								"Catalog",
								"Git Accounts",
								"API Builder",
								"Product",
								"Tenant",
								"Tenant oAuth",
								"Tenant Application"
							],
							"delete": [
								"Environment",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Tenant Settings",
								"Daemons",
								"HA Cloud",
								"Catalog",
								"Git Accounts",
								"API Builder",
								"Product",
								"Tenant",
								"Tenant oAuth",
								"Tenant Application"
							]
						}
					]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_DEVEL",
			"name": "Developer",
			"description": "This package is ideal for a developer. You are not giving much access but yet it is enough to sail and fast.",
			"acl": {
				"dashboard": {
					"oauth": [
						{
							"version": "1",
							"delete": [
								"Tokenization",
								"User Tokenization",
								"Cient Tokenization"
							],
							"post": [
								"Tokenization",
								"Guest"
							],
							"get": [
								"Guest"
							]
						}
					],
					"urac": [
						{
							"version": "2",
							"get": [
								"My Account",
								"Tenant",
								"Guest Email Account Settings",
								"Guest Password Settings",
								"Guest Email Validation"
							],
							"post": [
								"My Account",
								"Guest Password Settings"
							]
						}
					],
					"dashboard": [
						{
							"version": "1",
							"get": [
								"Continuous Delivery",
								"Environment",
								"Templates",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Services",
								"Daemons",
								"Hosts",
								"HA Cloud",
								"Catalog",
								"Continuous Integration",
								"Git Accounts",
								"API Builder",
								"Secrets"
							],
							"post": [
								"Continuous Delivery",
								"Environment",
								"Templates",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Services",
								"Daemons",
								"Hosts",
								"HA Cloud",
								"Continuous Integration",
								"Git Accounts",
								"API Builder",
								"Secrets",
								"Private Tenant ACL",
								"Continuous Delivery Deployment",
								"Simulate",
								"swagger"
							],
							"put": [
								"Continuous Delivery",
								"Environment",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Services",
								"Daemons",
								"HA Cloud",
								"Continuous Integration",
								"Git Accounts",
								"API Builder"
							],
							"delete": [
								"Environment",
								"Templates",
								"Environment Databases",
								"Resources",
								"Custom Registry",
								"Environment Platforms",
								"Daemons",
								"HA Cloud",
								"Continuous Integration",
								"Git Accounts",
								"API Builder",
								"Secrets"
							]
						}
					],
					"multitenant": [
						{
							"version": "1",
							"get": [
								"Product",
								"Console product",
								"Tenant"
							],
							"post": [
								"Product",
								"Tenant"
							],
							"delete": [
								"Product",
								"Tenant"
							],
							"put":[
								"Product",
								"Tenant"
							]
						}
					]
				}
			},
			"_TTL": 21600000
		}
	]
};

module.exports = lib;
