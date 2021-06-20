const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require('../middlewares/auth');
const validAuthFormFields = require("../middlewares/validAuthFormFields");
const nocache = require("nocache");

const encryptEmail = require('../middlewares/encryptEmail');

/*validAuthFormFields,*/

router.post( '/signup', nocache(), encryptEmail,  userController.signup );
router.post( '/login', nocache(), encryptEmail, userController.login );




module.exports = router;