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

app.command("/docs", async ({ command, ack, say, client, payload }) => {
  try {
    await ack();
    let txt = command.text;
    const aClient = algoliasearch(
      process.env.ALGOLIA_SPACE,
      process.env.ALGOLIA_TOKEN,
    );
    const index = aClient.initIndex(process.env.ALGOLIA_INDEX);

    const results = await index.search({
      query: txt,
      highlightPostTag: '*',
      highlightPreTag: '*',
      hitsPerPage: 5,
    });
    if (results.hits.length === 0) {
      say("No results found");
    }
    else {
      const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `There are *${results.nbHits} Results* for *"${txt}"*`,
          },
        },
        {
          type: 'divider',
        },
      ];

      results.hits.forEach(h => {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${h.hierarchy.lvl0}*\n${h.url}`,
          },
          // accessory: {
          //   type: 'button',
          //   action_id: 'share_doc',
          //   value: h.url,
          //   text: {
          //     type: 'plain_text',
          //     text: 'Send to Slack',
          //   }
          // }
        });
        blocks.push({
          type: 'divider',
        });
      });

      const elements = [
        {
          type: 'mrkdwn',
          text: `Search Time: ${results.processingTimeMS}ms`,
        },
      ];

      if (results.nbHits > 10) {
        elements.unshift({
          type: 'mrkdwn',
          text: `See All Results at https://materialize.com/docs`,
        });
      }

      blocks.push({
        type: 'context',
        elements,
      });

      const result = await client.views.open(
        {
          trigger_id: command.trigger_id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: 'Search Results',
            },
            close: {
              type: "plain_text",
              text: "Close"
            },
            blocks
          }
        }
      );
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.action('share_doc', async ({ ack, body, client, logger }) => {
  // Acknowledge the button request
  await ack();
  try {
    const result = await client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'selected_url',
        title: {
          type: 'plain_text',
          text: 'Publish link'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: body.actions[0].value
            },
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Post'
        }
      }
    });
  }
  catch (error) {
    logger.error(error);
  }
});

app.start(3001);
