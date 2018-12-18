const { RTMClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = 'xoxb-506357030896-506942755380-z984IjM7yrflMTdNTP5xf4Yr';

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'C1232456';

// The RTM client can send simple string messages
rtm.sendMessage('Hello there', conversationId)
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);