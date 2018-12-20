'use strict'
const request = require('request');
function handleWitResponse(res) {

    return res.entities;
}

module.exports = function witCLient(token) {

    // make http call to wit.ai and receive a json with parsed data
    const ask = function ask(message, callback) {
        request('https://api.wit.ai/message?v=20181220&q=' + message, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                //console.log('body:', body);
                body = JSON.parse(body);
                let witResponse = handleWitResponse(body);
                return callback(null, witResponse);

            } else {
                console.log('error', error, response && response.statusCode);
                return callback(error);
            }
        });
        console.log(`ask:` + message);
        console.log(`token:` + token);
    }
    return { ask: ask };
}