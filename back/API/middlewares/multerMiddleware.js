import createHttpError from 'http-errors';
import multer from 'multer';

const mimeTypes = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
    'image/webp' : 'webp',
    'image/gif' : 'gif'
};

/**
 * Défini la configuration de multer (qui gère l'upload de fichier )
 */
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        let error = null;

        if(!(file.mimetype in mimeTypes)) 
            error = createHttpError.BadRequest(`type/mime ${file.mimetype} image not unabled`);

        const name = file.originalname.split(' ').join('_').split('.').join('_');
        cb(error, `${name}-${Date.now()}.${mimeTypes[file.mimetype]}` )            
    }
})



   
export default multer({ storage: storage }).single('image')