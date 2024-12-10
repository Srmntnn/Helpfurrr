const { MailtrapClient } = require("mailtrap");
require('dotenv').config();

const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT, 
  token: process.env.MAILTRAP_TOKEN,
  testInboxId: 3201904,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "HelpFurr",
};

module.exports = {
  mailtrapClient,
  sender
}