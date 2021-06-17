const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require('../middlewares/auth');
const validAuthFormFields = require("../middlewares/validAuthFormFields");
const nocache = require("nocache");


router.post( '/signup', nocache(), validAuthFormFields, userController.signup );
router.post( '/login', nocache(), validAuthFormFields, userController.login );


module.exports = router;