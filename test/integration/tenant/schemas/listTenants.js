let listTenantsSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "array",
            "required": false,
            "items": {
                "type": "object",
                "required": true,
                "additionalProperties": false,
                "properties": {
                    "_id": {"type": "string", "required": true},
                    "code": {"type": "string", "required": true},
                    "name": {"type": "string", "required": true},
                    "description": {"type": "string", "required": false},
                    "type": {"type": "string", "required": false},
                    "tag": {"type": "string", "required": false},
                    "oauth": {"type": "object", "required": false}, // TODO: Change when oauth schema created
                    "applications": {"type": "array", "required": false}, // TODO: Change when applications schema created
                }
            }
        },
        "errors": {
            "type": "object",
            "required": false,
            "properties": {
                "codes": {
                    "type": "array",
                    "required": true
                },
                "details": {
                    "type": "array",
                    "required": true
                }
            }
        }
    }
};

module.exports = listTenantsSchema;

