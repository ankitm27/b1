const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var defaultQuestionSchema = new mongoose.Schema({
    bot_name:{type:String},
    bot_type:{type:Number},
    template:[
        {
            question:{type:String},
            options:[{type:String}],
            message_type:{type:Number}       
        }
    ]
    
});

defaultQuestionSchema.plugin(timestamps);

module.exports = mongoose.model("DefaultQuestion",defaultQuestionSchema);