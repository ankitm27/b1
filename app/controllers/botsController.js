//middleware function 
const resp = require('../utils/responseMessage')
const universalfunction = require('../utils/middlewareFunction')
const logger = require('../utils/logging');


//models
const BusinessBots = require('../models/businessBots');
const DefaultQuestion = require("../models/defaultQuestion");
const CustomTemplate = require('../models/customTemplate');
const OpenTrigger = require('../models/openTriggers');
const DefaultTriggerPoint = require('../models/defaultTriggerPoint');
const BusinessTriggerPoint = require('../models/businessTriggerPoints')

//modules
const async = require('async');

//exports functions
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

function enableBots(req, res) {
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;

    async.auto({
        checkAlreadyDisabledByBusiness: function (cb) {
            BusinessBots.update({ "business_id": business_id, "bot_id": bot_id }, { "is_disable": false }, function (err, result) {
                if (err) {
                    logger.trace("some problem in checkAlreadyDisabledByBusiness", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else if (result.nModified == 1 || result.n == 1) {
                    logger.trace("update is_disable checkAlreadyDisabledByBusiness ", result);
                    cb(resp.SUCCESS.ENABLE_BOT);
                } else {
                    logger.trace("Bot for this business id comes first time checkAlreadyDisabledByuBusiness ", result);
                    cb(null, result);
                }
            })
        },
        enableFirstTime: ['checkAlreadyDisabledByBusiness', function (result, cb) {
            const bot = new BusinessBots({
                bot_id: bot_id,
                business_id: business_id
            })
            bot.save(function (err, resu) {
                if (err) {
                    logger.trace("some problem in enableFirstTime", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully enable bot in enableFirstTime ", resu);
                    cb(null, resu);
                }
            })
        }],
        copyDefaultTemplateFirstTime: ['checkAlreadyDisabledByBusiness', 'enableFirstTime', function (result,cb) {
            var function_array = [];
            const parameter_to_pass = {
                bot_id: bot_id,
                business_id: business_id
            }
            function_array.push(copyContent.bind(null, parameter_to_pass));
            async.series(function_array,function(err,resu){
                if (err) {
                    logger.trace("some problem in asyncSeries", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully copy bot in asyncSeries ", resu);
                    cb(null, resu);
                }
            }) 
        }]
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in enableBots ", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully enable state enableBots", result);
            universalfunction.sendSuccess(resp.SUCCESS.ENABLE_BOT, null, res);
        }
    })
}



function disableBots(req, res) {
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;
    async.series([
        function (cb) {
            BusinessBots.findOneAndUpdate({ "business_id": business_id, "bot_id": bot_id }, { "is_disable": true }, { upsert: true }, function (err, result) {
                if (err) {
                    logger.trace("some problem in disabling bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully disable bot ", result);
                    cb(null, result);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in disabling bot in disableBots", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully disable state disbleBots", result);
            universalfunction.sendSuccess(resp.SUCCESS.DISABLE_BOT, null, res);
        }
    })
}

function getAllEnableBots(req, res) {
    const business_id = req.body.business_id;
    async.series([
        function (cb) {
            BusinessBots.find({ "business_id": business_id, "is_disable": false }, { "_id": 1, "bot_id": 1, "business_id": 1 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in getAllEnableBot bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get all enable bots getAllEnableBots ", result);
                    cb(null, result);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in getAllEnableBots", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get all enable bots", result);
            universalfunction.sendSuccess(resp.SUCCESS.GET_ALL_ENABLE_BOTS, result[0], res);
        }
    })
}



function getDefaultTemplateByBotId(req, res) {
    const bot_id = req.body.bot_id;
    async.series([
        function (cb) {
            DefaultQuestion.findById((bot_id), { "_v": 0 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in findDefaultTemplateByBotId bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get template findDefaultTemplateByBotId ", result);
                    cb(null, result);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in findDefaultTemplateByBotId", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get template findDefaultTemplateByBotId", result);
            universalfunction.sendSuccess(resp.SUCCESS.GET_TEMPLATE_BY_BOT_ID, result, res);
        }
    })
}


function createCustomTemplate(req, res) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const template = req.body.template;
    const number_of_question = req.body.number_of_question;

    async.auto({
        checkBusinessEnableForBot: function (cb) {
            BusinessBots.count({ "business_id": business_id, "bot_id": bot_id, "is_disable": false }, function (err, result) {
                if (err) {
                    logger.trace("some problem in checkBusinessEnableForBot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else if (result == 0) {
                    logger.trace("business is not enable with this bot id checkBusinessEnableForBot ", result);
                    cb(resp.ERROR.BUSINESS_NOT_ENABLE);
                } else {
                    logger.trace("Bot is enable for this business checkBusinessEnableForBot ", result);
                    cb(null, result);
                }
            })
        },
        createCustomTemplate: ['checkBusinessEnableForBot', function (result, cb) {
            const custom_template = new CustomTemplate({
                bot_id: bot_id,
                business_id: business_id,
                template: template,
                number_of_question: number_of_question
            })
            custom_template.save(function (err, resu) {
                if (err) {
                    logger.trace("some problem in createCustomTemplate query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully create template createCustomTemplate ", resu);
                    cb(null, resu);
                }
            })
        }]
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in createCustomTemplate", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get template createCustomTemplate", result);
            universalfunction.sendSuccess(resp.SUCCESS.CREATE_CUSTOM_TEMPLATE, null, res);
        }
    })
}




function getCustomTemplateByBusinessId(req, res) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    async.series([
        function (cb) {
            CustomTemplate.find({ "bot_id": bot_id, "business_id": business_id }, { "__v": 0, "template._id": 0 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in getCustomTeamplebyBusinessId bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get template getCustomTeamplebyBusinesId ", result);
                    cb(null, result);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in getCustomTeamplebyBusinessId", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get template getCustomTeamplebyBusinessId", result);
            universalfunction.sendSuccess(resp.SUCCESS.CREATE_CUSTOM_TEMPLATE, result, res);
        }
    })
}






function updateCustomTemplate(req, res) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const template = req.body.template;
    const number_of_question = req.body.number_of_question;

    async.auto({
        checkBusinessEnableForBot: function (cb) {
            BusinessBots.count({ "business_id": business_id, "bot_id": bot_id, "is_disable": false }, function (err, result) {
                if (err) {
                    logger.trace("some problem in checkBusinessEnableForBot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else if (result == 0) {
                    logger.trace("business is not enable with this bot id checkBusinessEnableForBot ", result);
                    cb(resp.ERROR.BUSINESS_NOT_ENABLE);
                } else {
                    logger.trace("Bot is enable for this business checkBusinessEnableForBot ", result);
                    cb(null, result);
                }
            })
        },
        createCustomTemplate: function (cb) {
            CustomTemplate.update({ "business_id": business_id, "bot_id": bot_id }, { "template": template, "number_of_question": number_of_question }, function (err, result) {
                if (err) {
                    logger.trace("some problem in createCustomTemplate query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully create template createCustomTemplate ", result);
                    cb(null, result);
                }
            })
        }
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in createCustomTemplate", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get template createCustomTemplate", result);
            universalfunction.sendSuccess(resp.SUCCESS.CREATE_CUSTOM_TEMPLATE, null, res);
        }
    })
}


function enableBotByButton(req, res) {
    const business_id = req.body.business_id;
    const channel_id = req.body.channel_id;

    async.auto({
        getAllEnableBot: function (cb) {
            BusinessBots.find({ "business_id": business_id, "is_disable": false }, { "_id": 0, "bot_id": 1 }).populate('bot_id', 'bot_name').exec(function (err, result) {
                if (err) {
                    logger.trace("some problem in getAllEnableBot bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get all enable bots getAllEnableBot ", result);
                    cb(null, result);
                }
            })
        },
        startedBotForChannel: ['getAllEnableBot', function (result, cb) {
            OpenTrigger.find({ "channel_id": channel_id }, { "_id": 0, "bot_id": 1 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in startedBotForChannel bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get template startedBotForChannel ", result);
                    cb(null, result);
                }
            })
        }],
        getButtonEnableBot: ['getAllEnableBot', 'startedBotForChannel', function (result, cb) {
            const allEnableBots = result.getAllEnableBot;
            const startedBotForChannel = result.startedBotForChannel;
            var button_trigger_bot = [];
            for (var i = 0; i < startedBotForChannel.length; i++) {
                var start_id = startedBotForChannel[i].bot_id;
                for (var j = 0; j < allEnableBots.length; j++) {
                    var t = 0;
                    if (start_id.toString() == allEnableBots[j].bot_id._id.toString()) {
                        //  button_trigger_bot.push(allEnableBots[j].bot_id);
                        t = 1;
                    }
                    if (t == 0) {
                        button_trigger_bot.push(allEnableBots[j].bot_id);
                    }
                }
            }
            logger.trace("get all trigger bot by button getButtonEnableBot " + button_trigger_bot)
            cb(null, button_trigger_bot);
        }]
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in enableBotByButton", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get template createCustomTemplate", result);
            universalfunction.sendSuccess(resp.SUCCESS.ENABLE_BOT_BY_BUTTON, result.getButtonEnableBot, res);
        }
    })
}



function getDefaultTriggerForBot(req, res) {
    const bot_id = req.body.bot_id;

    async.auto([
        function (cb) {
            DefaultTriggerPoint.find({ "bot_id": bot_id }, function (err, resu) {
                if (err) {
                    logger.trace("some problem in getDefaultTriggerForBot bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get defaulttrigger getDefaultTriggerForBot ", resu);
                    cb(null, resu);
                }

            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in getDefaultTriggerForBot", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get default trigger points getDefaultTriggerForBot", result);
            universalfunction.sendSuccess(resp.SUCCESS.SUCCESSFULLY_GET_DEFAULT_TEMPLATE, result[0], res);
        }
    })
}



function setTriggerPoints(req, res) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const triggers = req.body.triggers;

    async.auto([
        function (cb) {
            var business_trigger_points = new BusinessTriggerPoint({
                bot_id: bot_id,
                business_id: business_id,
                triggers: triggers
            })
            business_trigger_points.save(function (err, resu) {
                if (err) {
                    logger.trace("some problem in setTriggerPoints bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully set trigger points setTriggerPoints ", resu);
                    cb(null, resu);
                }

            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in setTriggerPoints", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get default trigger points setTriggerPoints", result);
            universalfunction.sendSuccess(resp.SUCCESS.SUCCESSFULLY_SET_TRIGGER, result[0], res);
        }
    })

}




function getAllTriggerPoints(req, res) {
    const business_id = req.body.business_id;
    async.auto({
        findAllEnableBotsForBusiness: function (cb) {
            BusinessBots.find({ "business_id": business_id, "is_disable": false }, { "bot_id": 1, "_id": 0 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in findAllEnableBotsForBusiness bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get all enable bots findAllEnableBotsForBusiness ", result);
                    cb(null, result);
                }
            })
        },
        getAllTriggeringPoints: ['findAllEnableBotsForBusiness', function (result, cb) {
            const all_enable_bots = result.findAllEnableBotsForBusiness;
            console.log("all_enable_bots ", all_enable_bots);
            var all_enable_bots_array = [];
            for (var i = 0; i < all_enable_bots.length; i++) {
                all_enable_bots_array.push(all_enable_bots[i].bot_id);
            }
            console.log(all_enable_bots_array);
            BusinessTriggerPoint.find({ "business_id": business_id, "bot_id": { $in: all_enable_bots_array } }, { "_id": 0, "bot_id": 1, "business_id": 1, "triggers": 1 }, function (err, resu) {
                if (err) {
                    logger.trace("some problem in getAllTriggeringPoints bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully set trigger points getAllTriggeringPoints ", resu);
                    cb(null, resu);
                }
            })
        }]
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in getAllTriggerPoints", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get trigger points getAllTriggerPoints", result);
            universalfunction.sendSuccess(resp.SUCCESS.SUCCESSFULLY_GET_TRIGGERING_POINT, result.getAllTriggeringPoints, res);
        }
    })
}



function updateTriggerPoints(req, res) {
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    const triggers = req.body.triggers;

    async.auto([
        function (cb) {
            BusinessTriggerPoint.findOneAndUpdate({ "bot_id": bot_id, "business_id": business_id }, { "triggers": triggers }, function (err, resu) {
                if (err) {
                    logger.trace("some problem in updateTriggerPoints bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully set trigger points updateTriggerPoints ", resu);
                    cb(null, resu);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            logger.trace("some problem in updateTriggerPoints", err);
            universalfunction.sendError(err, res);
        } else {
            logger.trace("successfully get default trigger points updateTriggerPoints", result);
            universalfunction.sendSuccess(resp.SUCCESS.SUCCESSFULLY_UPDATE_TRIGGERING_POINT, null, res);
        }
    })

}




//--------------------middleware function -------------------

function copyContent(parameter_for_pass, cb2) {
    const bot_id = parameter_for_pass.bot_id;
    const business_id = parameter_for_pass.business_id;

    async.auto({
        findDefaultTemplate: function (cb) {
            console.log("bot_id" + bot_id); 
            DefaultQuestion.find({ "_id": bot_id }, function (err, result) {
                if (err) {
                    logger.trace("some problem in copyContent bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get default template points copyContent ", result);
                    cb(null, result);
                }
            })
        },
        copyDefaultTemplate: ['findDefaultTemplate', function (result,cb) {
            const template = result.findDefaultTemplate[0].template;
            var copy_template_content = new CustomTemplate({
                bot_id: bot_id,
                business_id: business_id,
                number_of_question: template.length,
                template: template,
            })
            copy_template_content.save(function (err, resu) {
                if (err) {
                    logger.trace("some problem in copyDefaultTemplate bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get default template points copyDefaultTemplate ", resu);
                    cb(null, resu);
                }
            })
        }
        ],
        findDefaultTriggeringPoint: function (cb) {
            DefaultTriggerPoint.find({ "bot_id": bot_id }, function (err, result) {
                if (err) {
                    logger.trace("some problem in findDefaultTriggeringPoint bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get default trigger points findDefaultTriggeringPoint ", result);
                    cb(null, result);
                }
            })
        },
        copyDefaultTrigger: ['findDefaultTriggeringPoint', function (result, cb) {
            const triggers = result.findDefaultTriggeringPoint[0].triggers;
            var copy_trigger_content = new BusinessTriggerPoint({
                bot_id: bot_id,
                business_id: business_id,
                triggers: triggers
            })
            copy_trigger_content.save(function (err, resu) {
                if (err) {
                    logger.trace("some problem in copyDefaultTrigger bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get default template points copyDefaultTrigger ", resu);
                    cb(null, resu);
                }
            })
        }]
    }, function (err, result) {
        if (err) {
            logger.trace("some problem in copyContent bot query", err);
            cb2(resp.ERROR.QUERY_ERROR);
        } else {
            logger.trace("successfully get default template points copyContent ", result);
            cb2(null, result);
        }
    })
}