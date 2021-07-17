const mongoose = require('mongoose');


// Webhook schema
const WebhookSchema = new mongoose.Schema(
  {
    targetURL :{
      type: String,
      required: true
    }
  }
);


const Webhook = mongoose.model('Webhook', WebhookSchema);
module.exports = Webhook;