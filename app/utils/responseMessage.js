'use strict'
exports.ERROR = {
    FIELD_VALIDATION_FAILED : {
        statusCode:401,
        customMessage : 'There is some problem to validates the field.',
        type : 'FIELD_VALIDATION_FAILED'
    },
    QUERY_ERROR : {
        statusCode:401,
        customMessage : 'There is some problem IN query.',
        type : 'QUERY_ERROR'
    },
    BUSINESS_NOT_ENABLE : {
        statusCode:401,
        customMessage : 'Bot is not enable for this business.',
        type : 'BUSINESS_NOT_ENABLE'
    },
    TEMPLATE_EXIST : {
        statusCode:401,
        customMessage : 'Business already created the template.',
        type : 'TEMPLATE_EXIST'
    },
    ANSWER_NOT_MATCHED : {
        statusCode:401,
        customMessage : 'please fill the correct answer.',
        type : 'ANSWER_NOT_MATCHED'
    },
    RESPONSE_NOT_MATCHED : {
        statusCode:401,
        customMessage : 'Not found any particular response for this message.',
        type : 'RESPONSE_NOT_MATCHED'
    }
}



exports.SUCCESS = {
    ENABLE_BOT: {
        statusCode: 200,
        customMessage: 'successfully enable bot ',
        type: 'ENABLE_BOT'
    },
    DISABLE_BOT: {
        statusCode: 200,
        customMessage: 'successfully disable bot ',
        type: 'DISABLE_BOT'
    },
    GET_ALL_ENABLE_BOTS: {
        statusCode: 200,
        customMessage: 'successfully get all enable bots ',
        type: 'GET_ALL_ENABLE_BOTS'
    },
    GET_TEMPLATE_BY_BOT_ID: {
        statusCode: 200,
        customMessage: 'successfully get template by bot id ',
        type: 'GET_TEMPLATE_BY_BOT_ID'
    },
    CREATE_CUSTOM_TEMPLATE: {
        statusCode: 200,
        customMessage: 'successfully created template by bot id ',
        type: 'CREATE_CUSTOM_TEMPLATE'
    },
    GET_CUSTOM_TEMPLATE: {
        statusCode: 200,
        customMessage: 'successfully get custom template ',
        type: 'GET_CUSTOM_TEMPLATE'
    },
    TRIGGER_CREATED: {
        statusCode: 200,
        customMessage: 'successfully created trigger ',
        type: 'TRIGGER_CREATED'
    },
    ENABLE_BOT_BY_BUTTON: {
        statusCode: 200,
        customMessage: 'successfully enable bot by button ',
        type: 'ENABLE_BOT_BY_BUTTON'
    },
    SUCCESS_GET_MESSAGE: {
        statusCode: 200,
        customMessage: 'successfully get messages ',
        type: 'SUCCESS_GET_MESSAGE'
    },
    SUCCESS_VALIDATES_ANSWER: {
        statusCode: 200,
        customMessage: 'successfully validates answer ',
        type: 'SUCCESS_VALIDATES_ANSWER'
    },
    SUCCESSFULLY_GET_DEFAULT_TEMPLATE: {
        statusCode: 200,
        customMessage: 'successfully get default template ',
        type: 'SUCCESSFULLY_GET_DEFAULT_TEMPLATE'
    },
    SUCCESSFULLY_SET_TRIGGER: {
        statusCode: 200,
        customMessage: 'successfully set trigger ',
        type: 'SUCCESSFULLY_SET_TRIGGER'
    },
    SUCCESSFULLY_GET_TRIGGERING_POINT: {
        statusCode: 200,
        customMessage: 'successfully get triggering points ',
        type: 'SUCCESSFULLY_GET_TRIGGERING_POINT'
    },
    SUCCESSFULLY_UPDATE_TRIGGERING_POINT: {
        statusCode: 200,
        customMessage: 'successfully update triggering points ',
        type: 'SUCCESSFULLY_UPDATE_TRIGGERING_POINT'
    },
    ACTION_FOR_MESSAGE: {
        statusCode: 200,
        customMessage: 'suessfully get action for message ',
        type: 'ACTION_FOR_MESSAGE'
    },
    MESSAGE_RECIEVE: {
        statusCode: 200,
        customMessage: 'suessfully receive message ',
        type: 'MESSAGE_RECIEVE'
    }
}