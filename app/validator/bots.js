'use strict'

//modules
const resp = require('../utils/responseMessage')
const universalfunction = require('../utils/middlewareFunction')
const Joi = require('joi');
const logger = require('../utils/logging');


//exports
exports.enableBots = enableBots;
exports.disableBots = disableBots;
exports.getAllEnableBots = getAllEnableBots;
exports.getDefaultTemplateByBotId = getDefaultTemplateByBotId;
exports.createCustomTemplate = createCustomTemplate;
exports.getCustomTemplateByBusinessId = getCustomTemplateByBusinessId;
exports.updateCustomTemplate = updateCustomTemplate;
exports.enableBotByButton = enableBotByButton;
exports.getDefaultTriggerForBot = getDefaultTriggerForBot;
exports.setTriggerPoints = setTriggerPoints;
exports.getAllTriggerPoints = getAllTriggerPoints;
exports.updateTriggerPoints = updateTriggerPoints;

function enableBots(req, res, next) {
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;

    const schema = Joi.object().keys({
        business_id: Joi.string().required(),
        bot_id: Joi.string().required()
    })
    Joi.validate({ business_id: business_id, bot_id: bot_id }, schema, function (err, result) {
        if (err) {
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            next();
        }

    })
}


function disableBots(req, res, next) {
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;

    const schema = Joi.object().keys({
        business_id: Joi.string().required(),
        bot_id: Joi.string().required()
    })
    Joi.validate({ business_id: business_id, bot_id: bot_id }, schema, function (err, result) {
        if (err) {
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            next();
        }

    })
}


function getAllEnableBots(req, res, next) {
    const business_id = req.body.business_id;


    const schema = Joi.object().keys({
        business_id: Joi.string().required(),
    })
    Joi.validate({ business_id: business_id }, schema, function (err, result) {
        if (err) {
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            next();
        }

    })
}

function getDefaultTemplateByBotId(req, res, next) {
    const bot_id = req.body.bot_id;

    const schema = Joi.object().keys({
        bot_id: Joi.string().required()
    });

    Joi.validate({ "bot_id": bot_id }, schema, function (err, result) {
        if (err) {
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();getCustomTemplateByChannelId
        }

    })
}

function createCustomTemplate(req, res, next) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const template = req.body.template;
    const number_of_question = req.body.number_of_question;


   const templateSchema = Joi.object().keys({
        question_number: Joi.number().required(),
        message_type: Joi.number().required(),
        question: Joi.string().required(),
        options: Joi.string().required()
    });
   
   
   
    const schema = Joi.object().keys({
        bot_id: Joi.string().required(),
        business_id: Joi.string().required(),
        template: Joi.array().length(number_of_question).items(templateSchema).required(),
        number_of_question: Joi.number().required()
    });


    Joi.validate({ "bot_id": bot_id, "business_id": business_id, "template": template, "number_of_question": number_of_question }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}



function getCustomTemplateByBusinessId(req, res,next) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;

    const schema = Joi.object().keys({
        bot_id: Joi.string().required(),
        business_id: Joi.string().required()
    });


    Joi.validate({ "bot_id": bot_id, "business_id": business_id }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}



function updateCustomTemplate(req, res, next) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const template = req.body.template;
    const number_of_question = req.body.number_of_question;



    // const templateSchema = Joi.object().Keys({
    //     question_number:Joi.number().required(),
    //     messgage_type:Joi.number().required(),
    //     question:Joi.string().required(),
    //     options:Joi.string().required()
    // })
    
    
    const schema = Joi.object().keys({
        bot_id: Joi.string().required(),
        business_id: Joi.string().required(),
        template: Joi.array().length(number_of_question).items(templateSchema).required(),
        number_of_question: Joi.number().required()
    });


    Joi.validate({ "bot_id": bot_id, "business_id": business_id, "template": template, "number_of_question": number_of_question }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}

function enableBotByButton(req,res,next){
    const channel_id = req.body.channel_id;
    const business_id = req.body.business_id;

    const schema = Joi.object().keys({
        channel_id: Joi.string().required(),
        business_id: Joi.string().required(),
    });

    Joi.validate({ "channel_id": channel_id, "business_id": business_id }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}


function getDefaultTriggerForBot(req,res,next){
    const bot_id = req.body.bot_id;

    const schema = Joi.object().keys({
        bot_id: Joi.string().required()
    });

    Joi.validate({ "bot_id": bot_id }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}


function setTriggerPoints(req,res,next){
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const triggers = req.body.triggers;  

    const schema = Joi.object().keys({
        bot_id: Joi.string().required(),
        business_id : Joi.string().required(),
        triggers: Joi.array().items(Joi.string()).required()
    });

    Joi.validate({ "bot_id": bot_id,"business_id":business_id,"triggers":triggers }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}


function getAllTriggerPoints(req,res,next){
    const business_id = req.body.business_id;

    const schema = Joi.object().keys({
        business_id: Joi.string().required()
     });

    Joi.validate({ "business_id": business_id }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })

}

function updateTriggerPoints(req,res,next){
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const triggers = req.body.triggers;  

    const schema = Joi.object().keys({
        bot_id: Joi.string().required(),
        business_id : Joi.string().required(),
        triggers: Joi.array().items(Joi.string()).required()
    });

    Joi.validate({ "bot_id": bot_id,"business_id":business_id,"triggers":triggers }, schema, function (err, result) {
        if (err) {
            logger.trace("vaidation failed", err);
            universalfunction.sendError(resp.ERROR.FIELD_VALIDATION_FAILED, res)
        } else {
            console.log(result);
            next();
        }

    })
}
