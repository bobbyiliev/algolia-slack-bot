# Node.js Slack bot for quick Algolia search

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env
```

Set the following environment variables in your system:

```bash
SLACK_BOT_TOKEN=        # Find in the Oauth  & Permissions tab
SLACK_SIGNING_SECRET=   # Find in Basic Information Tab
SLACK_APP_TOKEN=        # Create an App-level Token

ALGOLIA_SPACE=          # Your Algolia Space
ALGOLIA_TOKEN=          # Algolia read-only API key
ALGOLIA_INDEX=          # Your Algolia Index
```

Run the bot:

```bash
node index.js
```

## Configure your Slack bot

1. Start by creating a new Slack App from scratch: https://api.slack.com/apps/

1. Then go to Basic information, and under App-Level Tokens and generate a new Token. Make sure to give this token the scopes "connections: write" and "authorizations: read".

1. Next go to Socket Mode and enable Socket Mode. 

1. Next, go to OAuth & Permissions, and find the Scopes section. Add the necessary scopes.

1. After that add a slash command by going to the Slash Commands tab in the Slack API dashboard and press "Create New Command". Set the name to "docs" and the command to "/docs".

Finally go to Slack and type `/docs` in the channel you want to use the bot.

## Example

![Algilia Slack Bot Search](https://user-images.githubusercontent.com/21223421/186692231-700a6e18-9aa3-4827-8d46-92ee823674b0.gif)
