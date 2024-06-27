const UserService = require('../services/user.service');
const UserReportService = require("../services/userReport.service");
const UserReport = require("../models/userReport.model");
const UserTranscriptionService = require('../services/userTranscription.service');
const UserTranscription = require('../models/userTranscription.model');
const { Storage } = require('@google-cloud/storage');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');
const OpenAI = require("openai");

const storage = new Storage();
const client = new SpeechClient();
const bucketName = 'testbucket-hackathon';
const localAudioPath = '/Users/ramis/Desktop/extrait.wav';
const remoteFileName = 'extrait.wav';
// Définir le chemin des informations d'identification
const CREDENTIALS_PATH = "/Users/ramis/Desktop/single-being-427608-h9-336be855846f.json";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
process.env.GOOGLE_APPLICATION_CREDENTIALS = CREDENTIALS_PATH;

const getUsers = async (req, res) => {
    const users = await UserService.getUsers();
    res.json(users);
}

const getUserReport = async (req, res) => {
    const { userId } = req.params;
    const userReport = await UserService.getUserReport(userId);
    res.json(userReport);
}

const updateUserReports = async (req, res) => {
    const { userId } = req.params;
    const reportUpdates = req.body;
    await UserService.updateUserReports(userId, reportUpdates);
    res.json({ message: "User report updated" });
}

const askToGpt = async (req, res) => {
    const { userId } = req.params;
    const { messages } = req.body;
    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `Vous êtes un assistant IA qui fournit des conseils de premiers secours et des conseils de base pour les symptômes de maladies ou de blessures. Par exemple, vous pouvez donner des conseils sur la façon de traiter des coupures mineures, ce qu'il faut faire en cas de fièvre, ou comment gérer une entorse. Cependant, si une question est trop complexe ou nécessite des connaissances médicales professionnelles, vous devez répondre par : "Cette situation nécessite l'attention d'un professionnel de la santé qualifié. Veuillez contacter un médecin ou vous rendre à l'établissement médical le plus proche." Priorisez toujours la sécurité et la nécessité de consulter un avis médical professionnel lorsque cela est nécessaire. Lors de la réponse, incluez le type de rapport parmi uniquement ces 5 types de rapports (possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark). La réponse sera le texte donné au patient par le chatbot. Et le rapport sera une phrase courte pour identifier le problème du patient (exemple : Coupure, Rhume, Intoxication alimentaire externe, etc...) et au format : {"typeOfReport": "(possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark)", "report": "REPORT", "response": "CONTENT"}`
                },
                ...messages,
            ]
        });
        const responseContent = gptResponse.choices[0].message.content;
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent);
        } catch (error) {
            parsedResponse = null;
        }
        if (
            parsedResponse &&
            parsedResponse.typeOfReport &&
            parsedResponse.report
        ) {
            const userService = new UserReportService();
            await userService.add(
                parseInt(userId, 10),
                parsedResponse.typeOfReport.slice(0, 255), // Ensure typeOfReport does not exceed column length
                parsedResponse.report,
                true
            );
            res.send(parsedResponse.response);
        } else {
            res.send(responseContent);
        }
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        res
            .status(500)
            .send("An error occurred while communicating with the OpenAI API");
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
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `Résumé la transcription suivante.`
                },
                {
                    "role": "user",
                    "content": transcriptionText
                }
            ]
        });
        const summary = completion.choices[0].message.content;
        const data = ({
            sequences: transcription,
            resume: summary
        })
        if (transcription && summary) {
            const userTranscriptionService = new UserTranscriptionService();
            await userTranscriptionService.add(userId, data);
        }
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `Si tu trouve des information pertinente je veux que tu analyse ce résumé de la transcription d'un appele et que tu me ressorts lors de la réponse le type de rapport parmi uniquement ces 5 types de rapports (possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark). La réponse sera le texte donné au patient par le chatbot. Et le rapport sera une phrase courte pour identifier le problème du patient (exemple : Coupure, Rhume, Intoxication alimentaire externe, etc...) et au format : {"typeOfReport": "(possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark)", "report": "REPORT", "response": "CONTENT"}`
                },
                {
                    "role": "user",
                    "content": summary
                }
            ]
        });
        const responseContent = gptResponse.choices[0].message.content;
        const parsedResponse = JSON.parse(responseContent);
        if (parsedResponse.typeOfReport && parsedResponse.report) {
            const userService = new UserReportService();
            const userReport = await userService.add(userId, parsedResponse.typeOfReport, parsedResponse.report, true);
        } else {
            res.status(400).send({ error: 'Invalid response format from ChatGPT' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Erreur lors de la transcription');
    }
}
const getRecords = async (req, res) => {
    const { userId } = req.params;
    const userTranscriptionService = new UserTranscriptionService();
    const data = await userTranscriptionService.getAll(userId);
    res.json(data);
}
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
module.exports = {
    getUsers,
    getUserReport,
    updateUserReports,
    askToGpt,
    generateTranscription,
    getRecords,
};