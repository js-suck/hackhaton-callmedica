# Projet Hackathon CalMedica

Découvrez notre solution SaaS révolutionnaire pour les soins de santé. Nous analysons automatiquement les messages vocaux et écrits des patients, transcrivons les enregistrements audio et générons des fiches patients détaillées et dynamiques. Chaque fiche intègre un suivi continu basé sur l'analyse des appels et des SMS. En cas de besoin, notre système offre des réponses automatiques avec des conseils simples et essentiels pour les patients.

## Fonctionnalités

- **Intégration ChatGPT** : Intégration de l'API OpenAI dans le but de fournir des conseils de premiers secours et des informations médicales de base. Cela nous sert à alimenter la base de données en fonction des messages des patients et des conversations audio, et également à créer des résumés sur tout le parcours d'un patient
  - **Auteur** : Lucas Ramis 5IW2 / [RamisL](https://github.com/RamisL) 

- **Chatbot IA** : Intégration d'un chatbot utilisant l'API OpenAI pour fournir des conseils de premiers secours et des informations médicales de base avec reconnaissance vocale.
  - **Auteur** : Antoine Chabernaud 5IW2 / [senex127](https://github.com/senex127) 

- **Gestion des fiches patient** : Création, modification et récupération des fiches patient avec gestion des différents types (Historiques médical, traitements, maladies possibles, etc.) ainsi que la récupération des patients enregistrés.
  - **Auteur** : Vivian Ruhlmann 5IW2 / [Loviflo](https://github.com/Loviflo)

- **Messages Préenregistrés** : Ajout d'un menu déroulant de messages préenregistrés pour aider les utilisateurs à poser rapidement des questions courantes.
  - **Auteur** : [Nom et Pseudo du Développeur]

- **Intégration Speech to Text** : Mise en place de la configuration du service Speech to Text de Google Cloud et enregistrement des conversations utilisateurs dans notre base de données.
  - **Auteur** : Lucas Ramis 5IW2 / [RamisL](https://github.com/RamisL)

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

### Configuration Speech to Text
1. Activez le service sur Google Cloud console

![Capture d’écran 2024-06-28 à 02.10.33.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Fd7%2Fskc0c7gd4f5fs2ny810lp6b80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_ennSHa%2FCapture%20d%E2%80%99%C3%A9cran%202024-06-28%20%C3%A0%2002.10.33.png)

2. Créez des identifiants de compte de service :
   - Allez sur Google Cloud Console.
   - Naviguez vers "API & Services" -> "Identifiants".
   - Cliquez sur "Créer des identifiants" et sélectionnez "Compte de service".
   
![Capture d’écran 2024-06-28 à 02.17.44.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Fd7%2Fskc0c7gd4f5fs2ny810lp6b80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_Ulg3bF%2FCapture%20d%E2%80%99%C3%A9cran%202024-06-28%20%C3%A0%2002.17.44.png)

3.  Téléchargez le fichier de clé JSON du nouveau compte de service  

    ```process.env.GOOGLE_APPLICATION_CREDENTIALS = "/chemin/vers/votre-fichier-clé.json";``


4. Pour les vidéos de plus de 1 mn, nous avons besoin de créer un bucket

![Capture d’écran 2024-06-28 à 02.19.08.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Fd7%2Fskc0c7gd4f5fs2ny810lp6b80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_yjVOOE%2FCapture%20d%E2%80%99%C3%A9cran%202024-06-28%20%C3%A0%2002.19.08.png)

```
const bucketName = 'testbucket-hackathon';
const remoteFileName = 'extrait.wav';

async function uploadFileToGCS(localFilePath, remoteFileName) {
    try {
        await storage.bucket(bucketName).upload(localFilePath, {
            destination: remoteFileName,
        });
        return `gs://${bucketName}/${remoteFileName}`;
    } catch (err) {
        console.error('Erreur lors de l\'upload du fichier sur GCS :', err);
        throw err;
    }
}

const generateTranscription = async (req, res) => {
    const { userId } = req.params;
    try {
        const gcsUri = await uploadFileToGCS(localAudioPath, remoteFileName);
        const audio = {
            uri: gcsUri,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 24000,
            languageCode: 'fr-FR',
            audioChannelCount: 2,
            enableSeparateRecognitionPerChannel: true,
            model: 'telephony',
            diarizationConfig: {
                enableSpeakerDiarization: true,
                minSpeakerCount: 2,
            },
        };
        const request = {
            config: config,
            audio: audio,
        };
        const [operation] = await client.longRunningRecognize(request);
        const [response] = await operation.promise();
        const transcription = response.results.map(result => ({
            person: result.channelTag || 'Unknown',
            text: result.alternatives[0].transcript || 'No transcription available',
        }));
        const transcriptionText = transcription.map(t => `Speaker ${t.person}: ${t.text}`).join('\n');
        ....... La suite de votre code .............
```

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
