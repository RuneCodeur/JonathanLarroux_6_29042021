const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
let regex = new RegExp("^[A-Za-z-_ 0-9]+$");
let mailRegex = new RegExp("^[A-Za-z-_ 0-9.]+@([A-Za-z-_ 0-9-]+\.)+[A-Za-z]$");

exports.signup = (req, res, next) => {
  if ((regex.test(req.body.password) == true) && (mailRegex.test(req.body.email) == true)){
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(() => res.status(400).json({ message : "adresse email déja utilisé !" }));
      })
      .catch(error => res.status(500).json({ error }));
  } else{
    return res.status(403).json({ error: "caractère non autorisée." });
  }
};

exports.login = (req, res, next) => {
  if ((regex.test(req.body.password) == true) && (mailRegex.test(req.body.email) == true)){
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id},
              '487b05ac-0e11-4720-a02b-c36806ea094c',
              { expiresIn: '1H' },
              {httpOnly: true} 
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
  } else{
    return res.status(403).json({ error: "caractère non autorisée." });
  }
};