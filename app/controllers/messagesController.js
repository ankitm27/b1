//middleware function 
const resp = require('../utils/responseMessage')
const universalfunction = require('../utils/middlewareFunction')
const logger = require('../utils/logging');
const client = require('../../app');

//models
const OpenTrigger = require('../models/openTriggers');
const CustomTemplate = require('../models/customTemplate');
const BusinessTriggerPoint = require('../models/businessTriggerPoints')
const BusinessBots = require('../models/businessBots');

//modules
const async = require('async');
const validator = require("email-validator");
const webhooks = require('node-webhooks')

//exports functions
exports.buttonTrigger = buttonTrigger;
exports.getMessages = getMessages;

//create webhook
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs 
    httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes 
})

function buttonTrigger(req,res){
    const channel_id = req.body.channel_id;
    const bot_id = req.body.bot_id;
    const business_id = req.body.business_id;
    async.auto({
        createTrigger:function(cb){
            const open_trigger = new OpenTrigger({
                channel_id:channel_id,
                bot_id:bot_id
            })
            open_trigger.save(function(err,result){
                if(err){
                    logger.trace("some problem in createTrigger query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                }else{
                    logger.trace("cretaed trigger ", result);
                    cb(null,result);
                }
            }) 
        },
        extractFirstQuestionForChannel:['createTrigger',function(result,cb){
             CustomTemplate.find({"business_id":business_id,"bot_id":bot_id},{"template":1,"bot_id":1,"_id":0,template: {$elemMatch: {question_number:1}}},function(err,resu){
                 if(err){
                     logger.trace("some problem in extractFirstQuestionForChannel query", err);
                     cb(resp.ERROR.QUERY_ERROR);
                 }else{
                     logger.trace("successfully extracted question extractFirstQuestionForChannel", resu);
                     cb(null,resu);
                 }
             })
        }]
    },function(err,result){
        if(err){
            logger.trace("some problem in buttonTrigger ", err);
            universalfunction.sendError(err,res);
        }else{
            logger.trace("successfully trigger bot in buttonTrigger", result);
            universalfunction.sendSuccess(resp.SUCCESS.TRIGGER_CREATED, result.extractFirstQuestionForChannel, res);
        }
    })
}






function getMessages1(parameter){
    const channel_id = parameter.channel_id;
    const business_id = parameter.business_id;
    const message = parameter.message;
    
    async.auto({
        findMessageIsAnswerOrNot:function(cb){
               OpenTrigger.find({"channel_id":channel_id},{"stage":1,"bot_id":1},function(err,resu){
                   if(err){
                    logger.trace("some problem in findMessageIsAnswerOrNot query", err);
                    return cb(resp.ERROR.QUERY_ERROR);
                }
                var function_array = [];
                if(resu.length != 0){
                    var stage = resu[0]["stage"] + 1;
                    var bot_id = resu[0]["bot_id"];
                    //call answer is check;
                    const parameter_for_validatesAnswer = {
                        stage:stage,
                        bot_id:bot_id,
                        business_id:business_id,
                        message:message,
                        channel_id: channel_id    
                }
                    console.log("some entry available");
                    function_array.push(validatesAnswer.bind(null,parameter_for_validatesAnswer));
                }else{
                    const parameter_for_validatesAnswer = {
                        business_id:business_id,
                        message:message,
                        channel_id: channel_id    
                }
                logger.trace("no entry matches"); 
                function_array.push(findActionForMessage.bind(null,parameter_for_validatesAnswer))
                }
                async.series(function_array,function(err,result){
                    if(err){
                        logger.trace("in async series error",err);
                        cb(err);
                    }else{
                        logger.trace("in async series result",result);
                        cb(null,result);
                    }
                }) 
            }) 
        }
    },function(err,result){
        if(err){
            logger.trace("some problem in getMessages ", err);
            universalfunction.sendError(err,res);
        }else{
           logger.trace("successfully trigger bot in getMessages", result);
           universalfunction.sendSuccess(resp.SUCCESS.SUCCESS_GET_MESSAGE, result.findMessageIsAnswerOrNot, res);
        }
    })
}



function getMessages(req,res){
    const channel_id = req.body.channel_id;
    const business_id = req.body.business_id;
    const message = req.body.message;
    const user_type = req.body.user_type;
    const time_last_message_agent = req.body.last_message_agent_time;

    if(user_type == 2){
        client.client.set(channel_id,time_last_message_agent);
    }
    
    const parameter = {
        channel_id:channel_id,
        business_id:business_id,
        message:message
    }
    getMessages1(parameter);
    universalfunction.sendSuccess(resp.SUCCESS.MESSAGE_RECIEVE, null, res);
}






//---------------------------------------------middleware function-------------------//


function validatesAnswer(parameter_for_validatesAnswer,cb1){
    const bot_id = parameter_for_validatesAnswer.bot_id;
    const business_id = parameter_for_validatesAnswer.business_id;
    const message = parameter_for_validatesAnswer.message;
    const stage = parameter_for_validatesAnswer.stage;
    const channel_id = parameter_for_validatesAnswer.channel_id;
    
    async.auto({
        getAnswerAndMatch:function(cb){
            CustomTemplate.find({"business_id":business_id,"bot_id":bot_id},{"template":1,"bot_id":1,"_id":0,"number_of_question":1,template: {$elemMatch: {question_number:stage}}},function(err,result){
                 if(err){
                    logger.trace("some problem in getAnswerAndMatch query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                 }else{
                      logger.trace("sucessfully get answer in getAnswerAndMatch ", result);
                      cb(null,result);
                 }   
            })
        },
        verifyAnswer:['getAnswerAndMatch',function(result,cb){
            const message_type = result.getAnswerAndMatch[0].template[0].message_type;
            const options = result.getAnswerAndMatch[0].template[0].options[0];
            const verification_parameter = {
                message_type : message_type,
                options : options,
                message: message,
            }
            var verification_function = [];
            if(message_type == 1 && options == "email"){
                verification_function.push(emailValidator.bind(null,verification_parameter))
            }
            else if(message_type == 1 && options == "phone"){
                verification_function.push(phoneValidator.bind(null,verification_parameter))
            }
            
            async.series(verification_function,function(err,result){
                if(err){
                    logger.trace("error in verifyAnswer",err);
                    cb(err);
                }else{
                    if(result == 1){
                        logger.trace("answer matched in verifyAnswer ",result);
                        cb(null,message);
                    }else{
                        logger.trace("answer not matched verifyAnswer",result);
                        cb(resp.ERROR.ANSWER_NOT_MATCHED);
                    }
                }
            })
        }],
        //increase stage
        increaseStage:['getAnswerAndMatch','verifyAnswer',function(result,cb){
           const bot_id = result.getAnswerAndMatch[0].bot_id;
           OpenTrigger.update({"bot_id":bot_id,"channel_id":channel_id},{"stage":stage},function(err,result){
               if(err){
                   logger.trace("there is some error in increaseStage ",err);
                   cb(resp.ERROR.QUERY_ERROR);
               }else{
                   logger.trace("sucessfully updated stage",result);
                   cb(null,result);
               }
           })
        }],

        getNextTime:['getAnswerAndMatch','verifyAnswer','increaseStage',function(result,cb){
            const number_of_question = result.getAnswerAndMatch[0].number_of_question;
            if(number_of_question == stage){
                const data = {
                    "message":"channel have cleared all the stages the question"
                }
                logger.trace("channel reached to final answer",number_of_question);
                cb(null,data);
            }else{
              CustomTemplate.find({"business_id":business_id,"bot_id":bot_id},{"template":1,"bot_id":1,"_id":0,"number_of_question":1,template: {$elemMatch: {question_number:stage+1}}},function(err,result){
                 if(err){
                    logger.trace("some problem in getNextTime query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                 }else{
                      logger.trace("some problem in getNextTime query", err);
                      cb(null,result[0]);
                 }   
            })  
            }    
    }]
    },function(err,result){
        if(err){
            logger.trace("some problem in validatesAnswer ", err);
            cb1(err);
        }else{
           logger.trace("successfully trigger bot in validatesAnswer", result);
           cb1(null,result.getNextTime);
        }
    })
}






//--------------------------field validator---------------------------
function emailValidator(parameter_for_validatesAnswer,cb2){
    const message = parameter_for_validatesAnswer.message;
    if(validator.validate(message)){
        logger.trace("email verified in emailValidator",1);
        cb2(null,1);
    }else{
        logger.trace("email not verified in emailValidator",0)
        cb2(null,0);
    }
}


function phoneNumberValidation(parameter_for_validatesAnswer,cb2){
    const message = parameter_for_validatesAnswer.message;
    if(message.match(/^[7-9]{1}[0-9]{9}$/)){
         logger.trace("phone number verified in phoneNumberValidation",1);
         cb2(null,1);    
    }else{
        logger.trace("phone number not verified in phoneNumberValidation",0)
        cb2(null,0);
    }
}



//---------------------action mesaage middleware------------------------

function findActionForMessage(parameter_for_validatesAnswer,cb2){
    const business_id = parameter_for_validatesAnswer.business_id;
    const message = parameter_for_validatesAnswer.message;
    const channel_id = parameter_for_validatesAnswer.channel_id;
    
    async.auto({
        findAllEnableBotsForBusiness: function (cb) {
            BusinessBots.find({ "business_id": business_id, "is_disable": false }, { "bot_id": 1,"_id":0 }, function (err, result) {
                if (err) {
                    logger.trace("some problem in findAllEnableBotsForBusiness bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get all enable bots findAllEnableBotsForBusiness ", result);
                    cb(null, result);
                }
            })
        },
        findAllReleventTriggers:['findAllEnableBotsForBusiness',function(result,cb){
            const all_enable_bots = result.findAllEnableBotsForBusiness;
            var all_enable_bots_array = [];
            for(var i = 0;i<all_enable_bots.length;i++){
                all_enable_bots_array.push(all_enable_bots[i].bot_id);
             }
             console.log(all_enable_bots_array);
             BusinessTriggerPoint.find({"business_id":business_id,"bot_id": {$in: all_enable_bots_array }},{"_id":0,"bot_id":1,"triggers":1},function(err,result){
                 if (err) {
                    logger.trace("some problem in findAllReleventtriggers bot query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                } else {
                    logger.trace("successfully get all enable bots findAllReleventtriggers ", result);
                    cb(null, result);
                }
             })
        }],
        matchTriggeringPoint:['findAllEnableBotsForBusiness','findAllReleventTriggers',function(result,cb){
            const all_possible_triggers = result.findAllReleventTriggers;
            for(var i = 0;i<all_possible_triggers.length;i++){
                const triggers = all_possible_triggers[i].triggers;
                for(var j =0;j<triggers.length;j++){
                    const  trigger = triggers[j]
                    if(message == trigger){
                        logger.trace("successfully match mesage with trigger points",message);
                        return cb(null,all_possible_triggers[i].bot_id);
                    }
                }
            }
            logger.trace("does not find any response for this particular message",1);
            cb(resp.ERROR.RESPONSE_NOT_MATCHED)
        }],
       createTrigger:['findAllEnableBotsForBusiness','findAllReleventTriggers','matchTriggeringPoint',function(result,cb){
           const bot_id =  result.matchTriggeringPoint;
           const open_trigger = new OpenTrigger({
                channel_id:channel_id,
                bot_id:bot_id
            })
            open_trigger.save(function(err,result){
                if(err){
                    logger.trace("some problem in createTrigger query", err);
                    cb(resp.ERROR.QUERY_ERROR);
                }else{
                    logger.trace("cretaed trigger createTrigger", result);
                    cb(null,result);
                }
            }) 
      }],
      findReleventQuestion:['findAllEnableBotsForBusiness','findAllReleventTriggers','matchTriggeringPoint','createTrigger',function(result,cb){
          const bot_id =  result.matchTriggeringPoint;
          CustomTemplate.find({"business_id":business_id,"bot_id":bot_id},{"template":1,"bot_id":1,"_id":0,template: {$elemMatch: {question_number:1}}},function(err,resu){
                 if(err){
                     logger.trace("some problem in findReleventQuestion query", err);
                     cb(resp.ERROR.QUERY_ERROR);
                 }else{
                     logger.trace("successfully extracted question findReleventQuestion", resu);
                     cb(null,resu);
                 }
             })
      }] 
    },function(err,result){
         if (err) {
            logger.trace("some problem in findActionForMessage", err);
            cb2(err);
        } else {
            logger.trace("successfully get default trigger points findActionForMessage", result);
            cb2(null,result.findReleventQuestion);
        }
    })
} 