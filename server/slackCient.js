const { RTMClient } = require('@slack/client');
const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - usually xoxb)

// The client is initialized and then started to get an active connection to the platform

exports.init = function slackClient(token){
  const rtm = new RTMClient(token);
// Need a web client to find a channel where the app can post a message
  const web = new WebClient(token);

// Load the current channels list asynchrously
web.channels.list()
  .then((res) => {
    // Take any channel for which the bot is a member
    const channel = res.channels.find(c => c.is_member);

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Hello, world!', channel.id)
        // Returns a promise that resolves when the message is sent
        .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts}`))
        .catch(console.error);
    } else {
      console.log('This bot does not belong to any channel, invite it to at least one and try again');
    }
  });
  rtm.on('message', (message) => {
    // For structure of `message`, see https://a
    pi.slack.com/events/message
  
    // Skip messages that are from a bot or my own user ID
    if ( (message.subtype && message.subtype === 'bot_message') ||
         (!message.subtype && message.user === rtm.activeUserId) ) {
      return;
    }
  
    // Log the message
    console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
  });
  return rtm;
};



