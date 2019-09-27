let deleteApplicationExtKeySchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "integer",
            "required": false
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

module.exports = deleteApplicationExtKeySchema;

