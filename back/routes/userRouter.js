const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require('../middlewares/auth');
const validAuthFormFields = require("../middlewares/validAuthFormFields");


router.post( '/signup', validAuthFormFields, userController.signup );
router.post( '/login', validAuthFormFields, userController.login );

module.exports = router;