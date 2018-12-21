'use strict';

const express = require('express');
const service = express();
const request = require('request');
const moment = require('moment');
//https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key
service.get('/service/:location', (req, res, next) => {

        const lat = req.query.lat;   //        service/location?lat=..&long=..
        const long=req.query.long;
        var timestamp = +moment().format('X');
        console.log(timestamp);
        const apiKey = process.env.gmap_api_key;
        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + long + '&timestamp=' + timestamp + '&key='+apiKey, (err, response) => 
        {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            //need to parse the body since its still a string
            const result = JSON.parse(response.body);
           /*  console.log(result);
            console.log(result.dstOffset);
            console.log(result.rawOffset); */
            var readableDateString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');
            console.log(readableDateString);
            res.setHeader('Content-Type', 'text/plain');
            res.send(readableDateString);
        });
    });







module.exports = service;