'use strict';
let service = {
    "_id": "5d710656e80a1813d371e8cf",
    "name": "multitenant",
    "group": "SOAJS Core Services",
    "maintenance": {
        "port": {"type": "maintenance"},
        "readiness": "/heartbeat",
        "commands": [{
            "label": "Releoad Registry",
            "path": "/reloadRegistry",
            "icon": "registry"
        }, {"label": "Resource Info", "path": "/resourceInfo", "icon": "info"}]
    },
    "port": 4004,
    "requestTimeout": 30,
    "requestTimeoutRenewal": 5,
    "swagger": false,
    "versions": {
        "1": {
            "extKeyRequired": true,
            "oauth": false,
            "apis": []
        }
    }
};

module.exports = service;