# BPI - Application Web Angular TS Express MongoDB

⚠️ _Ce projet a été réalisé dans le cadre d'un exercice annuel de développement projet (architectures web des systèmes d'informations) du MASTER MIAGE à Amiens. Il s'agit d'une simulation visant à mettre en pratique les connaissances acquises dans le domaine du développement logiciel, de la gestion de projet et de l'analyse des besoins des utilisateurs. L'objectif principal de cet exercice est de permettre aux étudiants de développer leurs compétences techniques et de renforcer leur compréhension des principes de développement logiciel tout en travaillant sur un cas concret et réaliste. Aucune rémunération ou mise en publication n'est à prévoir, ce projet étant exclusivement destiné à des fins pédagogiques._ ⚠️

🚧 Cette **version 1** du projet comprend un ensemble restreint de fonctionnalités.

## Description du projet 📁

### Sujet de projet

L’objectif est de développer un site Web permettant au personnel de l'université de gérer le matériel : meubles, téléphones fixes, imprimantes, etc. Le matériel peut être stocké ou utilisé. S'il est stocké, il faut savoir dans quelle salle. S'il est utilisé, il faut aussi savoir dans quelle salle, et à qui le matériel a été confié. Le matériel peut être confié soit à un organisme (par exemple le département informatique), soit à un membre du personnel. Les utilisateurs (organismes ou membres individuels) doivent pouvoir consulter la liste des matériels disponibles, par type. Ils doivent pouvoir demander à se faire attribuer du matériel.

Le site doit au minimum offrir les fonctionnalités suivantes :

-   L’administrateur peut ajouter/supprimer un compte utilisateur (organisme ou membre individuel). L’administrateur et les utilisateurs peuvent modifier leur compte (mot de passe, etc).
-   Un utilisateur peut consulter les matériels disponibles, par type, consulter les matériels qui lui ont été attribués, demander à se faire attribuer un matériel, demander à rendre un matériel.
-   L'administrateur peut accepter une demande d'attribution, ou le retour d'un matériel. Il peut aussi ajouter un matériel dans la base, ou en retirer un.

### Partie optionelle

On peut développer un composant pour que l’administrateur puisse avoir un tableau de bord du matériel (nombre de matériels par type, matériels entrés ou sortis depuis une certaine date, etc). On peut ajouter des dates de renouvellement sur les matériels (par exemple une imprimante doit être renouvelée tous les 10 ans), avec des alertes à l’administrateur. On peut également ajouter des délais de retour pour certains matériels (par exemple une multiprise doit être ramenée dans la journée), avec là aussi des alertes. On peut ajouter des règles sur les utilisateurs qui les autorisent à se faire attribuer ou pas certains matériels (par exemple seule une institution peut emprunter un meuble, pas un individu).

## Installation 📥

Voici les instructions d'installation de l'environnement projet :

### Prérequis 🚨

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre système :
🚧 _Ce guide est destiné avant tout aux utilisateurs de **Windows**_

-   [Github Desktop](https://central.github.com/deployments/desktop/desktop/latest/win32)
-   [Node JS & NPM](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
-   [Docker Desktop](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module)
-   [Visual Studio Code](https://code.visualstudio.com/download)

### Instructions d'installation 📋

Ce projet demande de faire fonctionner en parallèle :
-   Le frontend => `~/frontend`
-   Le Backend => `~/backend`
-   La BDD => `~/backend`

1. **Configurer le fichier .env**

    Le projet se base sur un fichier `.env` placé à la racine du dossier `~/backend`. Ce fichier est à créer selon le modèle donné par le fichier `.env.lock`.

    - Copié le fichier `.env.lock` à la racine du dossier `~/backend` vers un fichier nommé `.env`.
    - Ouvrez dans éditeur de texte le fichier ainsi créé.
    - Modifiez les valeurs entre `" "` selon vos préférences.

    ```
        DB_NAME="your_db_name"
        DB_HOST=localhost
        DB_PORT=27018

        DB_USER_NAME="your_db_user_name"
        DB_USER_PASSWORD="your_db_user_password"

        DB_ROOT_NAME="your_db_root_name"
        DB_ROOT_USER_NAME="your_db_root_user_name"
        DB_ROOT_PASSWORD="your_db_root_password"

        SECRET_KEY="your_secret_key"
    ```

2. **Configurer Docker Desktop :**

    - Ouvrez Docker Desktop et connectez-vous ou créez un compte Docker si nécessaire.
    - Cochez l'intégration WSL Ubuntu dans les paramètres de Docker.
    - Minimisez la fenêtre.

3. **Configurer Github Desktop :**

    - Ouvrez Github Desktop et connectez-vous ou créez un compte Git.
    - Clonez le répertoire Git sur votre machine virtuelle Ubuntu WSL à l'emplacement de votre choix.
    - Ouvrez le répertoire cloné avec Visual Studio Code.

4. **Exécuter les commandes depuis un terminal :**
    🚧 _Le terminal utilisé doit permettre l'exécution des commandes `npm`_
    - Ouvrez un terminal à la racine du projet git de manière à avoir ceci :
    ```
    frontend
    backend
    ...
    ```
    - Exécutez successivement les commandes suivantes : 
    ```
    cd backend
    npm install
    docker-compose up -d
    cd ../frontend
    npm install
    ```

### Lancement du projet 📤

🚧 _Les prochaines étapes implique d'ouvrir 2 terminaux, un pour le frontend et l'autre pour le backend._

1. **Terminal du Frontend**
    Placer-vous à la racine du dossier `~/frontend` et exécutez
    ```
    npm start
    ```
2. **Terminal du Backend**
    Placer-vous à la racine du dossier `~/backend` et exécutez
    ```
    npm start
    ```
3. **Générer les documents de base**

    Dans un navigateur ou une solution logicielle permettant le test d'api, exécutez les routes suivantes :
    ```
    localhost:5000/api/tags/seed
    localhost:5000/api/organizations/seed
    localhost:5000/api/users/seed
    localhost:5000/api/materials/seed
    ```
4. **Connexion**
   Un utilisateur adminsitrateur est créé par le seed :
    ```
    email : johndoe@email.com
    pwd : admin
    ```

⚠️ _Ne fermez pas les terminaux tant que vous testez l'application._ ⚠️

### Arrêt du projet 🚫

Pour arrêter le projet, utilisez la commande **CTRL + C** dans chacun des terminaux. Puis depuis Docker Desktop stoppé le conteneur actif lié à l'application.


### Accès au site web 🌐

Vous n'avez qu'à saisir dans votre navigateur web `localhosh:4200` pour accéder à l'application coté client sinon l'api du serveur est accessible en `localhosh:5000/api/` suivi de la route voulue.

Assurez-vous de suivre ces instructions dans l'ordre pour une installation et une exécution correctes du projet.

---

_Ce Readme a été rédigé par Maël RHUIN et Reda ES SALHI._
