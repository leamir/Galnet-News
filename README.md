# Galnet News Bot #
A discord bot that was coded to get the latest Galatic news (from https://community.elitedangerous.com) and send it to a channel if it hasn't been already

How to use
---
* Clone the repository
* Add information to the .env: (replace the text after the `=`)
  * Set `BOT_TOKEN` to your discord token
  * Set `CLIENT_ID` to your bot's discord client id
  * Set `CHANNEL` to your news channel
  * Set `LOGS_CHANNEL` to a privite channel id, so that the bot can store what the last news it sent is
  * Set `PING_ROLE_ID` to the ID of a role that will be pinged on every new news
