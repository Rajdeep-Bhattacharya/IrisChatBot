'use strict'
require('dotenv').config();
const service = require('../server/service');
const slackClient = require('../server/slackCient');
require('dotenv').load();
const token = process.env.bot_user_auth_access_token;

const rtm = slackClient.init(token);
rtm.start();
