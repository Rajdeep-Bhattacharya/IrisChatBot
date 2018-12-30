const { RTMClient } = require('@slack/client');
const { WebClient } = require('@slack/client');
let nlp = null;
let rtm = null;
let service = null;
function handleOnAuthenticated(rtmStartData) {
  console.log(`logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', handler);
}
function sendMessage(message, channel) {
  rtm.sendMessage(message, channel)
    // Returns a promise that resolves when the message is sent
    .then((msg) => console.log(`Message sent to channel ${channel} with ts:${msg.ts}`))
    .catch(console.error);
}




function messageHandler(message) {
  // For structure of `message`, see https://api.slack.com/events/message

  // Skip messages that are from a bot or my own user ID
  if ((message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }
  //must include in the question to answer
  if (message.text.toLowerCase().includes('iris')) {
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent.");
        }
        //console.log(res);
        const intent = require('./intents/' + res.intent[0].value + 'Intent');
        intent.process(res,service, function (error, response) {
          if (error) {
            console.log("inside error"+error.message);
            return;
          }
         /*  console.log("response insde slack client");
          console.log(response); */
          return sendMessage(response, message.channel);
        });
      }
      catch (err) {
        console.log(err);
        console.log(res);
        return sendMessage("Sorry, I don't know what you are talking about",message.channel);
      }


    });
  }
}

exports.addAuthenticatedHandler = addAuthenticatedHandler;

// The client is initialized and then started to get an active connection to the platform
exports.init = function slackClient(token, witClient,serviceRegistry) {
  rtm = new RTMClient(token);
  // Need a web client to find a channel where the app can post a message
  const web = new WebClient(token);
  nlp = witClient;
  service = serviceRegistry;
  let channel = {};

  // Load the current channels list asynchrously
  web.channels.list()
    .then((res) => {
      // Take any channel for which the bot is a member.... may send to all channels the bot is added to remove later
      channel = res.channels.find(c => c.is_member);
      if (channel) {
        // use the `sendMessage()` method to send a simple string to a channel using the channel ID
        sendMessage("Hello, World!", channel.id);
      } else {
        console.log('This bot does not belong to any channel, invite it to at least one and try again');
      }
    });
  rtm.on('message', messageHandler);
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};



