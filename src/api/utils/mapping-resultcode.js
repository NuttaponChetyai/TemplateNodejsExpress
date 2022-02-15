const { RESULT } = require ('../utils/Result');
exports.mappingResultCode = (statusCode,desc) => {
    switch(statusCode) {
        case 400: return RESULT.BAD_REQUEST.resultCode;
        case 401: 
            if(desc === "TokenExpiredError")
                return RESULT.TOKEN_EXPIRED.resultCode;
            return RESULT.UNAUTHORIZED.resultCode;
        case 403: return RESULT.FORBIDDEN;
        case 500: return RESULT.INTERNAL_SERVER_ERROR.resultCode;
        default: break;
    }
};