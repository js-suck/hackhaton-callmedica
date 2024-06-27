# Projet Hackathon CalMedica

Découvrez notre solution SaaS révolutionnaire pour les soins de santé. Nous analysons automatiquement les messages vocaux et écrits des patients, transcrivons les enregistrements audio et générons des fiches patients détaillées et dynamiques. Chaque fiche intègre un suivi continu basé sur l'analyse des appels et des SMS. En cas de besoin, notre système offre des réponses automatiques avec des conseils simples et essentiels pour les patients.

## Fonctionnalités

- **Chatbot IA** : Intégration d'un chatbot utilisant l'API OpenAI pour fournir des conseils de premiers secours et des informations médicales de base avec reconnaissance vocale.
  - **Auteur** : Antoine Chabernaud 5IW2 / [senex127](https://github.com/senex127) 

- **Gestion des fiches patient** : Création, modification et récupération des fiches patient avec gestion des différents types (Historiques médical, traitements, maladies possibles, etc.) ainsi que la récupération des patients enregistrés.
  - **Auteur** : Vivian Ruhlmann 5IW2 / [Loviflo](https://github.com/Loviflo)

- **Messages Préenregistrés** : Ajout d'un menu déroulant de messages préenregistrés pour aider les utilisateurs à poser rapidement des questions courantes.
  - **Auteur** : [Nom et Pseudo du Développeur]

- **Sauvegarde des Conversations** : Enregistrement des conversations utilisateur dans une base de données MySQL.
  - **Auteur** : [Nom et Pseudo du Développeur]

- **Interface Utilisateur** : Conception de l'interface utilisateur en React, incluant des boutons, des icônes et des éléments de formulaire pour améliorer l'expérience utilisateur.
  - **Auteur** : [Nom et Pseudo du Développeur]

## Équipe de Développement

### Groupe 20

- **Nom** : Antoine Chabernaud 5IW2  
  - **Pseudo** : [senex127](https://github.com/senex127)

- **Nom** : Laila Charaoui 5IW2  
  - **Pseudo** : [lailacha](https://github.com/lailacha)
  
- **Nom** : Vivian Ruhlmann 5IW2  
  - **Pseudo** : [Loviflo](https://github.com/Loviflo)

- **Nom** : Lucas Ramis 5IW2  
  - **Pseudo** : [RamisL](https://github.com/RamisL)

## Procédure d’Installation et de Lancement

### Prérequis

- Node.js (version 14 ou supérieure)
- Docker
- Docker Compose

### Installation

1. Clonez le repository :
   ```bash
   git clone https://github.com/js-suck/hackhaton-callmedica
   cd hackhaton-callmedica
   ```

2. Installez les dépendances pour le frontend et le backend :

   - Frontend (React) :
     ```bash
     cd front
     yarn
     ```

   - Backend (Node.js) :
     ```bash
     cd ../back
     yarn
     ```

### Configuration

1. Backend : Créez un fichier `.env` dans le dossier `back` avec le contenu suivant :
   ```env
    OPENAI_API_KEY=
    APP_URL="http://localhost:3000"
    API_PORT=3002

   ```

2. Docker Compose : Assurez-vous que votre fichier `docker-compose.yml` dans le dossier `back` est configuré correctement pour la base de données MySQL.

### Lancement

1. Démarrez la base de données et le backend avec Docker Compose :
   ```bash
   cd back
   docker-compose up -d
   ```

2. Démarrez le serveur backend :
   ```bash
   yarn fixtures
   yarn start
   ```

3. Démarrez le serveur frontend :
   ```bash
   cd ../front
   npm run dev
   ```

4. Accédez à l'application à l'adresse `http://localhost:5173`.

## Remarques

- Assurez-vous que Docker est en cours d'exécution et que les ports nécessaires sont disponibles.
- Vérifiez que la clé API OpenAI est valide et correctement configurée dans le fichier `.env`.

Pour toute question ou problème, veuillez contacter l'un des développeurs de l'équipe.
