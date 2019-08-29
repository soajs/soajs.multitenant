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
    "errors": {
        601: "Model not found"
    },
    "schema": {

        "get": {
            "/products": {
                _apiInfo: {
                    "l": "List Products",
                    "group": "Product",
                    "groupMain": true
                }
            }
        }
    }
};