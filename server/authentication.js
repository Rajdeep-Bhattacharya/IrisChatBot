const slackEventsApi = require('@slack/events-api');
const passport = require('passport');
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;



// Initialize a data structures to store team authorization info (typically stored in a database)
const botAuthorizations = {};

// Helpers to cache and lookup appropriate client
// NOTE: Not enterprise-ready. if the event was triggered inside a shared channel, this lookup
// could fail but there might be a suitable client from one of the other teams that is within that
// shared channel.
const clients = {};


// Initialize Add to Slack (OAuth) helpers


exports.init = function authentication() {

    passport.use(new SlackStrategy({
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        skipUserProfile: true,
    }, (accessToken, scopes, team, extra, profiles, done) => {
        botAuthorizations[team.id] = extra.bot.accessToken;
        done(null, {});
    }));
    return passport;
};
exports.initSlackEvents = function intiSlackEvents() {
    const slackEvents = slackEventsApi.createEventAdapter(process.env.signing_secret, {
        includeBody: true
    });


    function getClientByTeamId(teamId) {
        if (!clients[teamId] && botAuthorizations[teamId]) {
            clients[teamId] = new SlackClient(botAuthorizations[teamId]);
        }
        if (clients[teamId]) {
            return clients[teamId];
        }
        return null;
    };

    // *** Greeting any user that says "hi" ***
    slackEvents.on('message', (message, body) => {
        // Only deal with messages that have no subtype (plain messages) and contain 'hi'
        if (!message.subtype && message.text.indexOf('hi') >= 0) {
            // Initialize a client
            const slack = getClientByTeamId(body.team_id);
            // Handle initialization failure
            if (!slack) {
                return console.error('No authorization found for this team. Did you install this app again after restarting?');
            }
            // Respond to the message back in the same channel
            slack.chat.postMessage({ channel: message.channel, text: `Hello <@${message.user}>! :tada:` })
                .catch(console.error);
        }
    });
    // *** Responding to reactions with the same emoji ***
    slackEvents.on('reaction_added', (event, body) => {
        // Initialize a client
        const slack = getClientByTeamId(body.team_id);
        // Handle initialization failure
        if (!slack) {
            return console.error('No authorization found for this team. Did you install this app again after restarting?');
        }
        // Respond to the reaction back with the same emoji
        slack.chat.postMessage(event.item.channel, `:${event.reaction}:`)
            .catch(console.error);
    });

    // *** Handle errors ***
    slackEvents.on('error', (error) => {
        if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
            // This error type also has a `body` propery containing the request body which failed verification.
            console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
  ${JSON.stringify(error.body)}`);
        } else {
            console.error(`An error occurred while handling a Slack event: ${error.message}`);
        }
    });
    return slackEvents;
};



/* 
add later into run.js
const authentication = require('../server/authentication');
const passport = authentication.init();
const slackEvents = authentication.initSlackEvents();

// *** Plug the event adapter into the express app as middleware ***
service.use('/slack/events', slackEvents.expressMiddleware());

// Plug the Add to Slack (OAuth) helpers into the express app
service.use(passport.initialize());

service.get('/', (req, res) => {
  res.send('<a href="/auth/slack"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>');
});
service.get('/auth/slack', passport.authenticate('slack', {
  scope: ['bot']
}));
service.get('/auth/slack/callback',
  passport.authenticate('slack', { session: false }),
  (req, res) => {
    res.send('<p>Iris was successfully installed on your team.</p>');
  },
  (err, req, res, next) => {
    res.status(500).send(`<p>Iris failed to install</p> <pre>${err}</pre>`);
  }
); */