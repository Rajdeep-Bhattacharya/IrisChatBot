'use strict'
require('dotenv').config();
const http = require('http');
const service = require('../server/service');
const slackClient = require('../server/slackCient');
const server = http.createServer(service);
require('dotenv').load();




const token = process.env.bot_user_auth_access_token;
//const logLevel = 'debug';
const rtm = slackClient.init(token);
rtm.start();

const port = process.env.server_port;
//start express only after connecting to channel
slackClient.addAuthenticatedHandler(rtm,()=>server.listen(port));
//event handler for printing when server starts
server.on('listening',()=>console.log(`IRIS is listening on ${server.address().port}`));
