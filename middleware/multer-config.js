const multer = require ('multer');
let regex = new RegExp("^[A-Za-z-éèêëçàâùï€$£_'.;:,@?!()\n 0-9]+$");

//formats d'images utilisés
const MIM_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//middleware pour enregistrer les images
const storage = multer.diskStorage({
    destination: (req, file, callback,) =>{
        const sauceObject = JSON.parse(req.body.sauce);
        //test les caractères envoyés
        if((regex.test(sauceObject.name) == true) && (regex.test(sauceObject.manufacturer) == true) && (regex.test(sauceObject.description) == true) && (regex.test(sauceObject.mainPepper) == true)){
            //la valeur heat doit être entre 1 et 10
            if((sauceObject.heat > 0) && (sauceObject.heat <= 10)){ 
        callback(null, 'images')
            }else{
                callback ('caractère non autorisée.');
            }
        }else{
            callback ('caractère non autorisée.');
        }
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIM_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');