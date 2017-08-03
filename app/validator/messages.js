'use strict'

//modules
const resp = require('../utils/responseMessage')
const universalfunction = require('../utils/middlewareFunction')
const Joi = require('joi');
const logger = require('../utils/logging');

//exports
exports.buttonTrigger = buttonTrigger;
exports.getMessages = getMessages;

function buttonTrigger(req, res, next) {
    const channel_id = req.body.channel_id;
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;
    
    const schema = Joi.object().keys({
        business_id:Joi.string().required(),
        channel_id: Joi.string().required(),
        bot_id: Joi.string().required()
        })

    Joi.validate({ channel_id: channel_id, business_id:business_id, bot_id: bot_id }, schema, function (err, result) {
        if (err) {
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            next();
        }

    })
}



function getMessages(req, res, next) {
    const channel_id = req.body.channel_id;
    const business_id = req.body.business_id;
    const message = req.body.message;
    const user_type = req.body.user_type;
    const last_message_agent_time = req.body.last_message_agent_time;

    const schema = Joi.object().keys({
        business_id:Joi.string().required(),
        channel_id: Joi.string().required(),
        message: Joi.string().required(),
        user_type: Joi.number().required(),
        last_message_agent_time:Joi.string().required()    
    })

    Joi.validate({ channel_id: channel_id, business_id:business_id, message: message,user_type:user_type,last_message_agent_time:last_message_agent_time }, schema, function (err, result) {
        if (err) {
            logger.trace("filed validation failed ",err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            next();
        }

    })
}