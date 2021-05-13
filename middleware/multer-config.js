const multer = require ('multer');
let regex = new RegExp("^[A-Za-z-éèêëçàâùï€$£_'.;:,@?!()\n 0-9]+$");

const MIM_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback,) =>{
        const sauceObject = JSON.parse(req.body.sauce);
        if((regex.test(sauceObject.name) == true) && (regex.test(sauceObject.manufacturer) == true) && (regex.test(sauceObject.description) == true) && (regex.test(sauceObject.mainPepper) == true)){
            if((sauceObject.heat > 0) && (sauceObject.heat <= 10)){
        callback(null, 'images')
            }else{
                callback ('caractère non autorisée.')
            }
        }else{
            callback ('caractère non autorisée.')
        }
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIM_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }

    
});

module.exports = multer({ storage }).single('image');