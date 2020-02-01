'use strict';

let token = {
    _id: "5e357bdfc5a59210a8152629",
    type: "accessToken",
    token: "ddfd5eb42417b480471b4cec06381244658ffc7a",
    clientId: "5c0e74ba9acc3c5a84a51259",
    user: {
	    _id: "5d63ce63617982b55a1c1800",
	    username: "test2",
	    password: "$2a$12$geJJfv33wkYIXEAlDkeeuOgiQ6y6MjP/YxbqLdHdDSK7LDG.7n7Pq",
	    firstName: "test2 first",
	    lastName: "test2 last",
	    email: "test2@localhost.com",
	    status: "active",
	    profile: {},
	    config: {
		    packages: {},
		    keys: {},
		    allowedTenants: [
		    ]
	    },
	    tenant: {
		    id: "5e348418ed5e433de5bea716",
		    code: "test2"
	    },
	    
        "ts": new Date().getTime(),
        lastLogin: new Date().getTime(),
        loginMode: "urac",
        id: "5d63ce63617982b55a1c1800"
    },
    env: "dashboard",
    expires: new Date((new Date().getFullYear()) + 2, 0, 1)
};

module.exports = token;