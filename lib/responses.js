const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
};

const getSuccessResponse = (data = {}, statusCode = 200) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
});

const getErrorResponse = (statusCode, error, message) => {
    const body = {
        error,
        message,
    };
    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    };
};

const getFormattedMessage = (responseJson) => {
    if (responseJson && responseJson.message) {
        if (responseJson.message.includes(':')) {
            return responseJson.message.split(':')[1].trim();
        }
        return responseJson.message;
    }
    return 'Unknown exception has occurred';
};

module.exports = {getSuccessResponse, getErrorResponse, getFormattedMessage};
