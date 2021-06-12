const express           = require('express');
const router            = express.Router();
const sauceController   = require('../controllers/sauceController');

router.get('/',     sauceController.getAllSauces);
router.get('/:id',  sauceController.getOneSauce);
router.post('/', sauceController.createSauce);
router.put('/:id',  sauceController.updateSauce);
router.delete('/:id', sauceController.deleteSauce);
router.post('/:id/like', sauceController.likeSauce)

module.exports = router;