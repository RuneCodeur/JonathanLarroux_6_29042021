const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
let regex = new RegExp("^[A-Za-z-_ 0-9]+$"); //caractères acceptables pour les mots de passe
let mailRegex = new RegExp("^[A-Za-z-_ 0-9.]+@([A-Za-z-_ 0-9-]+\.)+[A-Za-z]$"); //caractères acceptables pour les mails

//crée un nouveau compte utilisateur.
exports.signup = (req, res) => {
  //test les caractères envoyés
  if ((regex.test(req.body.password) == true) && (mailRegex.test(req.body.email) == true)){
    //crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //sauvegarde dans la base de donnée
        user.save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch(() => res.status(400).json({ message: "adresse email déjà utilisée !" }));
      })
      .catch(error => res.status(500).json({ error }));
  } else{
    return res.status(405).json({ error: "caractère non autorisé." });
  }
};

//connecte un utilisateur à son compte.
exports.login = (req, res) => {
  //test les caractères envoyés
  if ((regex.test(req.body.password) == true) && (mailRegex.test(req.body.email) == true)){ 
    //cherche le compte utilisateur qui possède ce mail
    User.findOne({ email: req.body.email })
      .then(user => {
        //si le compte n'est pas trouvé
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        //compare le mot de passe de la base de donnée avec celui envoyé
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          //si le mot de passe est différent
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //renvoie les infos suivantes
          res.status(200).json({
            userId: user._id,
            //token
            token: jwt.sign(
              { userId: user._id},
              '487b05ac-0e11-4720-a02b-c36806ea094c', //clé secrete
              { expiresIn: '1H' }, //durée d'expiration du token
              {httpOnly: true} //les autres sites ne peuvent se servir de ce token
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
  } else{
    return res.status(405).json({ error: "caractère non autorisé." });
  }
};