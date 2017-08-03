'use strict'

//models
const CustomTemplate = require('../models/customTemplate');

//middleware function
const resp = require('../utils/responseMessage')
const universalfunction = require('../utils/middlewareFunction')
const logger = require('../utils/logging');

//export functions
exports.isCreated = isCreated;

function isCreated(req, res,next) {
    const business_id = req.body.business_id;
    const bot_id = req.body.bot_id;

    CustomTemplate.count({ "business_id": business_id, "bot_id": bot_id }, function (err, result) {
        if (err) {
            logger.trace("some problem in isCreated", err);
            universalfunction.sendError(resp.ERROR.resp.ERROR.QUERY_ERROR, res)    
    } else if (result == 0) {
            next();
        } else {
            logger.trace("business cretaed custom template you only can update that.", result);
            universalfunction.sendError(resp.ERROR.TEMPLATE_EXIST, res) 
            }
    })
}