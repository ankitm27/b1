//models
const DefaultQuestion = require('./defaultQuestion');

//modules
const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var businessBotsSchema = new mongoose.Schema({
    business_id:{type:String},
    bot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultQuestion'
    },
    is_disable:{
      type:Boolean,
      default:false
  }
});

businessBotsSchema.plugin(timestamps);


module.exports = mongoose.model("BusinessBots",businessBotsSchema);