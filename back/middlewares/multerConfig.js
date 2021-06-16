const multer = require('multer');

const mimeTypes = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};


const storage = multer.diskStorage({
    
        destination: function (req, file, cb) {
            cb(null, 'images/')
        },
        filename: function (req, file, cb) {
            const name = file.originalname.split(' ').join('_').split('.').join('_');
            cb(null, `${name}-${Date.now()}.${mimeTypes[file.mimetype]}` )            
        }
    })

   
module.exports = multer({ storage: storage }).single('image')