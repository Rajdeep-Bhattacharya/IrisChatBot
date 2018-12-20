'use strict'
const request = require('request');

module.exports.process = function process(intentData,callback){

    if(intentData.intent[0].value!=='time'){
        return callback(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }
    if(!intentData.location){
        return callback(new Error(`missing location in time intent`));
    }
    const location = intentData.location[0].value;
    const lat = intentData.location[0].resolved.values[0].coords.lat;
    const long = intentData.location[0].resolved.values[0].coords.long;
    if(lat || long)
        console.log(`lat: ${lat} and long: ${long}`);
    const time_api_server_port = process.env.time_server_port;
    request(`http://localhost:`+time_api_server_port +`/service/${location}?lat=${lat}&long=${long}`, {
        method: "GET"
    }, function (error, response, body) {
       if(error)
        return callback(error,null);
        
        return callback(false,`the time at ${location} is ${response.result}`);
    });



    //return callback(false,`I dont yet know the time at ${intentData.location[0].value}`); 
}