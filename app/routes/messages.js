//modules
var express = require('express');
var router = express.Router();

//middleware functions
var messagesController = require('../controllers/messagesController');
var messagesValidator = require('../validator/messages');
var databaseValidation = require('../utils/databaseValidation');

router.post('/buttontrigger',messagesValidator.buttonTrigger,messagesController.buttonTrigger);
router.post('/getmessages',messagesValidator.getMessages,messagesController.getMessages);

module.exports = router;