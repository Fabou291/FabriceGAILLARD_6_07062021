const express           = require('express');
const router            = express.Router();
const sauceController   = require('../controllers/sauceController');
const multer = require('../middlewares/multerConfig');
const auth = require('../middlewares/auth');
const isOwner = require('../middlewares/isOwner');

router.get('/', auth,  sauceController.getAllSauces);
router.get('/:id', auth, sauceController.getOneSauce);
router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, isOwner, multer,  sauceController.updateSauce);
router.delete('/:id', auth, isOwner, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.likeSauce)

module.exports = router;

