module.exports.RESULT = Object.freeze({
    BAD_REQUEST: {
        resultCode: "40000",
        resultDescription: "Bad Request."
    },
    UNAUTHORIZED: {
        resultCode: "40100",
        resultDescription: "Unauthorized."
    },
    TOKEN_EXPIRED: {
        resultCode : "40101",
        resultDescription: "Access Token expired."
    },
    REFRESH_TOKEN_EXPIRED: {
        resultCode : "40102",
        resultDescription: "Refresh Token expired."
    },
    TOKEN_LOGOUT: {
        resultCode : "40103",
        resultDescription: "Token is logout."
    },
    SUCCESS: {
        resultCode: "20000"
    },
    CREATED: "20100",
    INTERNAL_SERVER_ERROR: {
        resultCode: "50000",
        resultDescription: "Internal server error."
    },
    DATA_NOT_FOUND: {
        resultCode: "40400",
        resultDescription: "Data not found."
    },
    FORBIDDEN: "40300",
    NIMBUS_ERROR: {
        resultCode: "50010",
        resultDescription: "NIMBUS ERROR"
    },
    ALREADY_EXISTS: {
        resultCode: "40300",
        resultDescription: "Already exists."
    },
    DATABASE_ERROR: {
        resultCode: "50030",
        resultDescription: "Database error."
    },
    REDIS_ERROR: {
        resultCode: "50020",
        resultDescription: "REDIS DATABASE ERROR."
    },
    SAML_ERROR: {
        resultCode: "50012",
        resultDescription: "SAML ERROR."
    }

});




