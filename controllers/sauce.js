const Sauce = require ('../models/Sauce');
const User = require ('../models/user');
const fs = require('fs');
let regex = new RegExp("^[A-Za-z-éèêëçàâùï€$£_'.;:,@?!()\n 0-9]+$"); //caractères acceptables

//crée un nouvel item sauce.
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Nouvelle sauce disponible !'}))
  .catch(error => res.status(500).json({ error }));
}

//renvoie 1 item sauce.
exports.getOneSauce = (req, res) => {
  Sauce.findOne({_id:req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));
}

//renvoie tout les items sauce.
exports.getAllSauces = (req, res) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch((error) => res.status(500).json({ error }));
}

//supprime 1 item sauce.
exports.deleteSauce = (req, res) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(500).json({ error }));
      });
  })
  .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));
}

//modifie les informations de 1 item sauce.
exports.modifySauce = (req, res) => {
  //si l'image est modifié
  if( req.file !== undefined){
      Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,() =>{
          const sauceObject ={...JSON.parse(req.body.sauce),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}; 
          Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
          .catch(error => res.status(500).json({ error }));
        });
      })
      .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));

  // si l'image n'est pas modifié
  }else if (req.file === undefined){
    //test les caractères envoyés
    if((regex.test(req.body.name) == true) && (regex.test(req.body.manufacturer) == true) && (regex.test(req.body.description) == true) && (regex.test(req.body.mainPepper) == true)){ 
      //la valeur heat doit être entre 1 et 10
      if((req.body.heat > 0) && (req.body.heat <= 10)){
        Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(500).json({ error }));
      }else{
        return res.status(405).json({ message: "Caractère non autorisé." });
      }
    }else{
      return res.status(405).json({ message: "Caractère non autorisé." });
    } 
  }
}

//modifie les valeurs likes/dislikes d'1 item sauce. Chaque compte utilisateur ne peux liker/disliker qu'une seule fois.
exports.modifyLike = (req, res) => {
  User.findOne({_id: req.body.userId})
  .then( user =>{
    if (user.email !== undefined){

      // si sa like
      if (req.body.like == 1 ){
        Sauce.findOne({_id: req.params.id, usersLiked: req.body.userId })
        .then(alreadyLiked => {
          if (alreadyLiked == null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { likes: 1 }, $addToSet: { usersLiked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'Goûts modifiés !'}))
            .catch(error => res.status(500).json({ error }));
          }else{
            return res.status(403).json({ message: "Action non autorisée." });
          }
        })
        .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));

        //si sa dislike
      } else if (req.body.like == -1 ){
        Sauce.findOne({_id: req.params.id, usersDisliked: req.body.userId })
        .then(alreadyDisliked => {
          if (alreadyDisliked == null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { dislikes: 1 }, $addToSet: { usersDisliked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'Goûts modifiés !'}))
            .catch(error => res.status(500).json({ error }));
          }else{
            return res.status(403).json({ message: "Action non autorisée." });
          }
        })
        .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));

        //si sa unlike
      }else if (req.body.like == 0 ){
        Sauce.findOne({_id: req.params.id, usersLiked: req.body.userId })
        .then(alreadyLiked => {
          if (alreadyLiked !== null){
            Sauce.updateMany({_id: req.params.id}, {$inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
            .then(() => res.status(200).json({ message: 'Goûts modifiés !'}))
            .catch(error => res.status(500).json({ error }));

            //si sa undislike
          }else {
            Sauce.findOne({_id: req.params.id, usersDisliked: req.body.userId })
            .then(alreadyDisliked => {
              if (alreadyDisliked !== null){
                Sauce.updateMany({_id: req.params.id}, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }})
                .then(() => res.status(200).json({ message: 'Goûts modifiés !'}))
                .catch(error => res.status(500).json({ error }));
              }else{
                return res.status(403).json({ message: "Action non autorisée." });
              }
            })
            .catch(error => res.status(500).json({ error }));
          }
        })
        .catch(() => res.status(404).json({ message : "cette sauce n'existe pas." }));
      }
      else{
        return res.status(400).json({ message: 'Format non reconnu.' });
      }
    }
  })
  .catch(() => res.status(403).json({ message: "Action non autorisée." }));
};