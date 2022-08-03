const { App } = require("@slack/bolt");
const dotenv = require("dotenv");
const algoliasearch = require("algoliasearch");

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/docs", async ({ command, ack, say }) => {
  try {
    await ack();
    let txt = command.text; // The inputted parameters
    const client = algoliasearch(
      process.env.ALGOLIA_SPACE,
      process.env.ALGOLIA_TOKEN,
    );
    const index = client.initIndex('materialize');

    const results = await index.search({
      query: txt,
      highlightPostTag: '*',
      highlightPreTag: '*',
      hitsPerPage: 5,
    });
    const hits = results.hits;
    if (hits.length === 0) {
      say("No results found");
    }
    else {
      
      const firstResult = hits[0];
      say(firstResult.url);
      // hits.forEach(hit => {
      //   say(hit.url);
      // }
      //);
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.start(3001);
