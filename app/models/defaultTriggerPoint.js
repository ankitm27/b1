//models


//modules
const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var defaultTriggerPointSchema = new mongoose.Schema({
    bot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultQuestion'
    },
    triggers:[{type:String}]
});

defaultTriggerPointSchema.plugin(timestamps);


module.exports = mongoose.model("DefaultTriggerPoint",defaultTriggerPointSchema);