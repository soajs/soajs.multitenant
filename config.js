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
    "errors": {
        430: "Tenant not found for this user.",
        460: "Unable to find product",
        601: "Model not found"
    },
    "schema": {
        "commonFields": {},
        "get": {
            "/products": {
                _apiInfo: {
                    "l": "List Products",
                    "group": "Product",
                    "groupMain": true
                }
            },
            "/tenants": {
                _apiInfo: {
                    "l": "List Tenants",
                    "group": "Tenant",
                    "groupMain": true
                }
            }
        }
    }
};