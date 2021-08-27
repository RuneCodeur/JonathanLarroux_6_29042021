projet 6 openclassrooms : construire une API sécurisée

la partie backend à été construit avec nodeJS et MongoDB.
la partie frontend du projet à été fournis par openclassrooms et se télécharge sur le liens suivant =>
https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git

------ installation ------
--------------------------

lancez l'invite de commande et exécutez les commandes suivante:

    cd "ADRESSE DU DOSSIER BACK-END"
    npm install

------ lancer le serveur ------
-------------------------------

pour lancer la partie backend et avoir accès à la base de donnée, envoyez un message de demande d'accès à la BDD avec votre adresse IP, à l'adresse mail suivante :
rackhamledev@gmail.com

lancez un invite de commande et exécutez les commandes suivante:
cd "ADRESSE DU DOSSIER BACKEND"
node server

------ infos ------
-------------------

le serveur backend possède les routes suivantes :
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