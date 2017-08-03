//models
const DefaultQuestion = require("./defaultQuestion");

//modules
const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var customTemplateSchema = new mongoose.Schema({
    bot_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DefaultQuestion'
    },
    business_id:{type:String},
    template:[
        {
            question_number:{type:Number},
            question:{type:String},
            options:[{type:String}],
            message_type:{type:Number}       
        }
    ],
    number_of_question:{type:Number}
});

customTemplateSchema.plugin(timestamps);

module.exports = mongoose.model("CustomTemplate",customTemplateSchema);