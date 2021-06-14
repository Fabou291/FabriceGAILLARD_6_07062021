const express           = require('express');
const router            = express.Router();
const sauceController   = require('../controllers/sauceController');
const multer = require('../middlewares/multerConfig')

router.get('/',     sauceController.getAllSauces);
router.get('/:id',  sauceController.getOneSauce);
router.post('/', multer, sauceController.createSauce);
router.put('/:id', multer, sauceController.updateSauce);
router.delete('/:id', sauceController.deleteSauce);
router.post('/:id/like', sauceController.likeSauce)

module.exports = router;