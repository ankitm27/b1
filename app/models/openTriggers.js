//models
const DefaultQuestion = require("./defaultQuestion");

//modules
const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var openTriggerSchema = new mongoose.Schema({
    bot_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultQuestion'
    },
    channel_id:{type:String},
    stage: {type:Number,default:0}
});

openTriggerSchema.plugin(timestamps);

module.exports = mongoose.model("OpenTrigger",openTriggerSchema);