//modules
var express = require('express');
var router = express.Router();

//middleware functions
var botsController = require('../controllers/botsController');
var botsValidator = require('../validator/bots');
var databaseValidation = require('../utils/databaseValidation');

router.post('/enablebots',botsValidator.enableBots,botsController.enableBots);
router.post('/disablebots',botsValidator.disableBots,botsController.disableBots);
router.post('/getallenablebots',botsValidator.getAllEnableBots,botsController.getAllEnableBots);
router.post('/getdefaulttemplatebybotid',botsValidator.getDefaultTemplateByBotId,botsController.getDefaultTemplateByBotId);
router.post('/createcustomtemplate',botsValidator.createCustomTemplate,databaseValidation.isCreated,botsController.createCustomTemplate)
router.post('/getcoutomteamplebybusinessid',botsValidator.getCustomTemplateByBusinessId,botsController.getCustomTemplateByBusinessId);
router.post('/updatecustomtemplate',botsValidator.updateCustomTemplate,botsController.updateCustomTemplate)
router.post('/enablebotbybutton',botsValidator.enableBotByButton,botsController.enableBotByButton)
router.post('/getdefaulttriggerforbot',botsValidator.getDefaultTriggerForBot,botsController.getDefaultTriggerForBot);
router.post('/settriggerpoints',botsValidator.setTriggerPoints,botsController.setTriggerPoints);
router.post('/getalltriggerpoints',botsValidator.getAllTriggerPoints,botsController.getAllTriggerPoints);
router.post('/updatetriggerPoints',botsValidator.updateTriggerPoints,botsController.updateTriggerPoints);
module.exports = router;

