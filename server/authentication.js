const slackEventsApi = require('@slack/events-api');
const passport = require('passport');
const slackEvents = slackEventsApi.createEventAdapter(process.env.signing_secret, {
  includeBody: true
});


// Initialize a data structures to store team authorization info (typically stored in a database)
const botAuthorizations = {}

// Helpers to cache and lookup appropriate client
// NOTE: Not enterprise-ready. if the event was triggered inside a shared channel, this lookup
// could fail but there might be a suitable client from one of the other teams that is within that
// shared channel.
const clients = {};
function getClientByTeamId(teamId) {
  if (!clients[teamId] && botAuthorizations[teamId]) {
    clients[teamId] = new SlackClient(botAuthorizations[teamId]);
  }
  if (clients[teamId]) {
    return clients[teamId];
  }
  return null;
}

// Initialize Add to Slack (OAuth) helpers
passport.use(new SlackStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    skipUserProfile: true,
  }, (accessToken, scopes, team, extra, profiles, done) => {
    botAuthorizations[team.id] = extra.bot.accessToken;
    done(null, {});
  }));
  

