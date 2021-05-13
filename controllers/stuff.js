const Sauce = require ('../models/Sauce');
const User = require ('../models/user');
const fs = require('fs');
let regex = new RegExp("^[A-Za-z-éèêëçàâùï€$£_'.;:,@?!()\n 0-9]+$");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Nouvelle sauce disponible !'}))
  .catch((error) => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id:req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(() => res.status(404).json({ message : "sauce non trouvé" }));
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
  })
  .catch(error => res.status(500).json({ error }));
}

exports.modifySauce = (req, res, next) => {

  //si l'image est modifié
  if( req.file !== undefined){
      Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,() =>{
          const sauceObject ={...JSON.parse(req.body.sauce),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
          Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));

  // si l'image n'est pas modifié
  }else if (req.file === undefined){
    if((regex.test(req.body.name) == true) && (regex.test(req.body.manufacturer) == true) && (regex.test(req.body.description) == true) && (regex.test(req.body.mainPepper) == true)){
      if((req.body.heat > 0) && (req.body.heat <= 10)){
        Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
      }else{
        return res.status(403).json({ error: "caractère non autorisée." });
      }
    }else{
      return res.status(403).json({ error: "caractère non autorisée." });
    } 
  }
}

exports.modifyLike = (req, res, next) => {
  User.findOne({_id: req.body.userId})
  .then( user =>{
    if (user.email !== undefined){

      // si sa like
      if (req.body.like == 1 ){
        Sauce.findOne({_id: req.params.id, usersLiked: req.body.userId })
        .then(alreadyLiked => {
          if (alreadyLiked == null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { likes: 1 }, $addToSet: { usersLiked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'goûts modifié !'}))
            .catch(error => res.status(500).json({ error }));
          }else{
            return res.status(403).json({ error: "action non autorisée." });
          }
        })
        .catch(error => res.status(500).json({ error }));

        //si sa dislike
      } else if (req.body.like == -1 ){
        Sauce.findOne({_id: req.params.id, usersDisliked: req.body.userId })
        .then(alreadyDisliked => {
          if (alreadyDisliked == null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { dislikes: 1 }, $addToSet: { usersDisliked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'goûts modifié !'}))
            .catch(error => res.status(500).json({ error }));
          }else{
            return res.status(403).json({ error: "action non autorisée." });
          }
        })
        .catch(error => res.status(500).json({ error }));

        //si sa unlike
      }else if (req.body.like == 0 ){
        Sauce.findOne({_id: req.params.id, usersLiked: req.body.userId })
        .then(alreadyLiked => {
          if (alreadyLiked !== null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'goûts modifié !'}))
            .catch(error => res.status(500).json({ error }));

            //si sa undislike
          }else {
            Sauce.findOne({_id: req.params.id, usersDisliked: req.body.userId })
            .then(alreadyDisliked => {
              if (alreadyDisliked !== null){
                Sauce.updateMany({_id: req.params.id}, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }})
                .then(() => res.status(200).json({ message: 'goûts modifié !'}))
                .catch(error => res.status(500).json({ error }));
              }else{
                return res.status(403).json({ error: "action non autorisée." });
              }
            })
          }
        })
      .catch(error => res.status(404).json({ error }));
      }
      else{
        return res.status(400).json({ error: 'format non reconnu.' });
      }
    }
  })
  .catch(() => res.status(403).json({ message: "action non autorisée." }));
};