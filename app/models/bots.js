var mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

var botsSchema = new mongoose.Schema({
    bot_name:{type:String},
    bot_type:{type:String}
});

botsSchema.plugin(timestamps);

module.exports = mongoose.model("Bots",botsSchema);