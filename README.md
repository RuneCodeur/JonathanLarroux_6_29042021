-- partie 6 de la formation développeur web de OpenClassrooms --

-- PROJET SO PEKOCKO --
-- partie backend --



les liens GitHub du projet peuvent être téléchargé sur les liens suivant =>

partie front-end:
https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git

partie back-end (réalisation par Jonathan LARROUX):
https://github.com/rackhamledev/JonathanLarroux_6_29042021.git



------ installation des fichiers ------
installez node en suivant ce lien => https://nodejs.org/en/
telechargez et décompressez le dossier front-end dans un dossier en suivant le lien précédent.
lancez l'invite de commande et exécutez les commandes suivante:

cd "ADRESSE DU DOSSIER FRONT-END"
npm install
npm install node-sass@4.14.1 

--note --
il est probable que 'npm install' signale des problèmes de vulnérabilité. 
faire une tentative de résolution avec 'npm audit fix' peux causer des problèmes de compatibilité, 
de même qu'installer une version différente de node-sass@4.14.1.


telechargez et décompressez le dossier back-end dans un dossier en suivant le lien précédent.
lancez l'invite de commande et exécutez les commandes suivante:

cd "ADRESSE DU DOSSIER BACK-END"
npm install


------ lancer le serveur ------
pour lancer la partie front-end, lancez un invite de commande et exécutez les commandes suivante:

cd "ADRESSE DU DOSSIER FRONT-END"
ng serve

pour lancer la partie back-end, lancez un invite de commande et exécutez les commandes suivante:
cd "ADRESSE DU DOSSIER FRONT-END"
node server



------ infos ------
le serveur front-end se connecte sur le lien suivant:
http://localhost:4200


le serveur back-end possède les routes suivantes :
http://localhost:3000/api/auth/signup
route de type POST. permet de créer un nouveau compte. un nouveau compte ne peux pas s'inscrire avec une adresse mail déja utilisé.
modèle du JSON attendu :
{
    email: string
    password : string
}

http://localhost:3000/api/auth/login
route de type POST. permet de connecter un utilisateur et d'acceder au site.
modèle du JSON attendu :
{
    email: string
    password : string
}

http://localhost:3000/api/sauces/
route de type GET. permet de récuperer la liste totale des sauces.

http://localhost:3000/api/sauces/
route de type POST. permet de créer une nouvelle sauce.
modèle du JSON attendu :
{
    name: string
    manufacturer: string
    description: string
    mainPepper: string
    heat: number
    userId: string
    imageUrl: string 
}

http://localhost:3000/api/sauces/:id
route de type GET. permet de récuperer une sauce précise.

http://localhost:3000/api/sauces/:id
route de type PUT. permet de modifier une sauce.
modèle du JSON attendu :
{
    name: string
    manufacturer: string
    description: string
    mainPepper: string
    heat: number
    userId: string
    imageUrl: string 
}

http://localhost:3000/api/sauces/:id
route de type DELETE. permet de supprimer une sauce.

http://localhost:3000/api/sauces/:id/like
route de type POST. permet de liker et disliker une sauce. enregistre l'utilisateur dans une liste afin que chaque utilisateur puisse liker/disliker qu'une seule fois.
note : la valeur like indique le comportement du serveur et doit être égale à 1, 0 ou -1
1 => like la sauce
-1 => dislike la sauce
0 => annule le like ou le dislike

modèle du JSON attendu :
{
    userId : string
    like : number
}