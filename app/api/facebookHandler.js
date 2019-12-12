const request = require('request');
const axios = require('axios');
const {
    PAGE_ACCESS_TOKEN,
} = require('../config/custom');


let handleMessage = async (sender_psid, received_message) => {
    // read by (received_message.text)

};


let callSendAPI = async (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
            console.log(JSON.stringify(res))
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = {
    handleMessage: handleMessage,
    callSendAPI: callSendAPI,
};