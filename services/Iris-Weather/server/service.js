'use strict';

const express = require('express');
const service = express();
const request = require('request');

service.get('/service/:location', (req, res, next) => {
    const api_key = process.env.weather_api_key;
    
    request.get('http://api.openweathermap.org/data/2.5/weather?q=' + 
    req.params.location + `&APPID=${api_key}&units=metric`, 
    (err, response) => {

        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }
        const body = JSON.parse(response.body);
        console.log(response.body);
        res.setHeader('Content-Type', 'text/plain');
        res.send(`${body.weather[0].description} at ${body.main.temp} degrees`);
    });
});

module.exports = service;