var mongoose = require("mongoose");
var actionSchema = new mongoose.Schema({
    bot_id:{type:String},
    business_id:{type:String},
    phrases:[{type:String}],
    timestamp:{type:String, default:new Date() },
    isDeleted:{type:Boolean,default:false}
    
});
module.exports = mongoose.model("actions",actionSchema);