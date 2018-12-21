'use strict';
require('dotenv').config();
require('dotenv').load();
const request = require('request');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
const port = process.env.server_port;
server.listen(port);

server.on('listening', function() {
    // announce time microservice to the main app
    const announce = ()=>{
        request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`,(err,res)=>{
            if(err){
                console.log("failed inside time service announcement "+err );
                return;
            }
            console.log(res.body);

        });
    }
    announce();
    //call announce every 15 secs
    setInterval(announce,15*1000);
    console.log(`IRIS-Time is listening on ${server.address().port} in ${service.get('env')} mode.`);
});