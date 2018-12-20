'use strict'
const request = require('request');

const weather_api_server_port =3001;

module.exports.process = function process(intentData,callback){

    if(intentData.intent[0].value!=='weather'){
        return callback(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
    }
    if(!intentData.location){
        return callback(new Error(`missing location in weather intent`));
    }
    const location = intentData.location[0].value;
    const lat = intentData.location[0].resolved.values[0].coords.lat;
    const long = intentData.location[0].resolved.values[0].coords.long;
   /*  if(lat || long)
        console.log(`lat: ${lat} and long: ${long}`);
     */
    request(`http://localhost:`+weather_api_server_port +`/service/${location}`, {
        method: "GET"
    }, function (error, response, body) {
       if(error)
        return callback(false, `I had a problem finding out the weather in ${location}`);
       /*  console.log("inside timeintent.js");
        console.log(response.body); */
        return callback(false,`the weather at ${location} is ${response.body}`);
    });



    //return callback(false,`I dont yet know the time at ${intentData.location[0].value}`); 
}