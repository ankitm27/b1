const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var businessTriggerPointSchema = new mongoose.Schema({
    bot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultQuestion'
    },
    business_id:{type:String},
    triggers:[{type:String}]
});

businessTriggerPointSchema.plugin(timestamps);


module.exports = mongoose.model("BusinessTriggerPoint",businessTriggerPointSchema);