const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS';
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../configs/vars');
const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc);
dayjs.extend(timezone);

exports.getTimestamp = () => {
    let timestamp = dayjs.tz(new Date(),"Asia/Bangkok").format(DATE_FORMAT);
    return timestamp;
};


exports.getRequestResponse = (req, res) => {
    let information = {
        request: req ? {
            method: req.method,
            uri: req.headers.host + req.url,
            headers: req.headers,
            body: req.body,
            params: req.params || undefined
        } : undefined,
        response: res ? {
            headers: res.headers,
            httpStatus: res.httpStatus,
            data: res.data
        } : undefined
    };
    return information;
};

exports.verifytoken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                let error = new Error('Token signature invalid.');
                reject(error);
            } else {
                resolve(decoded);
            }
        });
    });

};

exports.getUsername = (req) => {
    try {
        let authen_header = req.headers['authorization'];
        if (authen_header) {
            let access_token = authen_header.split(' ');
            if (access_token.length > 0 && access_token[0].toLowerCase() === 'bearer') {
                let userInfo = jwt.decode(access_token[1]);
                return userInfo.sub.informations.username;
            }
        } else {
            return undefined;
        }
    } catch (err) {
        return undefined;
    }
};