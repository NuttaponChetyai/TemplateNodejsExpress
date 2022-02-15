exports.generateResponse = (httpStatusCode, resultCode, resultData, resultDescription, developerMessage) => {
    let response = {
        responseData : {
            resultCode: resultCode,
            resultData: resultData,
            resultDescription: resultDescription,
            developerMessage: developerMessage || undefined
        },
        httpStatus : httpStatusCode
    };
    return response;
};


