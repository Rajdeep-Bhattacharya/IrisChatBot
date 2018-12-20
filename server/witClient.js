'use strict'
const request = require('request');

module.exports = function witCLient(token) {

   // make http call to wit.ai and receive a json with parsed data
    const ask = function ask(message) {
        request('https://api.wit.ai/message?v=20181220&q='+message, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
            }
          }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                console.log('body:', body);
              } else {

                console.log('error', error, response && response.statusCode);
              }
          });



        console.log(`ask:` + message);
        console.log(`token:` + token);
    }
    return { ask: ask };
}