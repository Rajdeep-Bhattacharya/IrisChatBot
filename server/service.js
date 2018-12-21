'use strict'

const express = require('express');
const service = express();
const serviceRegistry = require('./serviceRegistry');
//create object of serviceRegistry
const serviceRegistryObj = new serviceRegistry();
service.set('serviceRegistry',serviceRegistryObj);

service.put('/service/:intent/:port',(req,res,next)=>{
        const serviceIntent = req.params.intent;
        const port = req.params.port;
        //check if ip is IPv6 if true return JSON else not
        const serviceIp = req.connection.remoteAddress.includes("::")?
        `[${req.connection.remoteAddress}]`: req.connection.remoteAddress;
        serviceRegistryObj.addService(serviceIntent,serviceIp,port);
        res.json({result:`${serviceIntent} at ${serviceIp}:${port}`});
});


module.exports=service;