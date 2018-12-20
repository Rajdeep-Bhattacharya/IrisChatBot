const { RTMClient } = require('@slack/client');
const { WebClient } = require('@slack/client');
let nlp = null;
let rtm=null;
function handleOnAuthenticated(rtmStartData) {
  console.log(`logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', handler);
}
function sendMessage(message,channel) {
  rtm.sendMessage(message, channel)
    // Returns a promise that resolves when the message is sent
    .then((msg) => console.log(`Message sent to channel ${channel} with ts:${msg.ts}`))
    .catch(console.error);
}



function messageHandler(message){
    // For structure of `message`, see https://api.slack.com/events/message

    // Skip messages that are from a bot or my own user ID
    if ((message.subtype && message.subtype === 'bot_message') ||
      (!message.subtype && message.user === rtm.activeUserId)) {
      return;
    }
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("printing res in slackClient"+res);
      if (res==null || res.intent==null) {
        return sendMessage("Sorry, I don't know what you are talking about.", message.channel);

      } else if (res.intent[0].value === 'time' && res.location) {
        return sendMessage(`I don't yet know the time in ${res.location[0].value}`, message.channel);
      } else {
        console.log(res);
        return sendMessage("Sorry, I don't know what you are talking about.", message.channel);
      }

    });
    /* console.log(`(channel:${message.channel}) `);
    console.log(message);
    // Log the message
    console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
 */
  }




// The client is initialized and then started to get an active connection to the platform
exports.init = function slackClient(token, witClient) {
  rtm = new RTMClient(token);
  // Need a web client to find a channel where the app can post a message
  const web = new WebClient(token);
  nlp = witClient;
  exports.addAuthenticatedHandler = addAuthenticatedHandler;
  let channel = {};

  // Load the current channels list asynchrously
  web.channels.list()
    .then((res) => {
      // Take any channel for which the bot is a member.... may send to all channels the bot is added to remove later
      channel = res.channels.find(c => c.is_member);
      if (channel) {
        // use the `sendMessage()` method to send a simple string to a channel using the channel ID
        sendMessage( "Hello, World!",channel.id);
      } else {
        console.log('This bot does not belong to any channel, invite it to at least one and try again');
      }
    });
  rtm.on('message', messageHandler);
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};



