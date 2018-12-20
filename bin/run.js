'use strict'
require('dotenv').config();
const http = require('http');
const service = require('../server/service');
const slackClient = require('../server/slackCient');
const server = http.createServer(service);
require('dotenv').load();



const wit_token = process.env.wit_server_access_token;
const token = process.env.bot_user_auth_access_token;
//const logLevel = 'debug';
const witClient = require('../server/witClient')(wit_token);
const rtm = slackClient.init(token,witClient);
rtm.start();

const port = process.env.server_port;
//start express only after connecting to channel
slackClient.addAuthenticatedHandler(rtm,()=>server.listen(port));
//event handler for printing when server starts
server.on('listening',()=>console.log(`IRIS is listening on ${server.address().port}`));
