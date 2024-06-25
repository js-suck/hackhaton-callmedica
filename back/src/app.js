const OpenAI = require('openai');
const db = require('./db/sequelize')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./models/user.model');
const UserReportService = require('./services/userReport.service');
const UserReport = require('./models/userReport.model');
const userRoutes = require('./routes/user.routes');
require('dotenv-flow').config();
const PORT = process.env.API_PORT;

// Récupérez la liste des modèles synchronisés
const models = db.models;

// Parcourez la liste des modèles
for (const modelName in models) {
    if (models.hasOwnProperty(modelName)) {
        console.log(`Modèle trouvé : ${modelName}`);
    }
}

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoutes);

app.post('/api/:userId/ask', async(req, res) => {
    const { userId } = req.params;
    const ask = req.body.ask;
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });


    const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `You are an AI assistant that provides first aid and basic necessity advice for symptoms of illness or injuries. For example, you can give advice on how to treat minor cuts, what to do in case of a fever, or how to handle a sprained ankle. However, if a question is too complex or requires professional medical knowledge, you must respond with: "Cette situation nécessite l'attention d'un professionnel de la santé qualifié. Veuillez contacter un médecin ou vous rendre à l'établissement médical le plus proche." Always prioritize safety and the necessity of seeking professional medical advice when needed. When responding, include the type of report between ONLY with this 5 typeOfReport (possibleDiseases, discoveredDisease, medicalHistory, currentTreatment or remark). Response will be the text given to the patient by the chatbot. And report will be a short sentence to identify the patient's problem (example: Cut, Cold, External food poisoning, etc.) and in the format: {"typeOfReport": "(possibleDiseases, discoveredDisease, medicalHistory, currentTreatment or remark)", "report": "REPORT", "response": "CONTENT"}`
            },
            {
                "role": "user",
                "content": ask
            }
        ]
    });

    const responseContent = gptResponse.choices[0].message.content;
    console.log(responseContent);
    // Parse the response content to extract the typeOfReport and report
    const parsedResponse = JSON.parse(responseContent);

    // Ensure the parsedResponse contains the expected keys
    if (parsedResponse.typeOfReport && parsedResponse.report) {
        // Create a new user report
        const userService = new UserReportService();
        const userReport = await userService.add(userId, parsedResponse.typeOfReport, parsedResponse.report, true);
        res.send(gptResponse.choices[0].message.content);
    } else {
        res.status(400).send({ error: 'Invalid response format from ChatGPT' });
    }
   /* const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [ {
            "role": "system",
            "content": `You are an AI assistant that provides first aid and basic necessity advice for symptoms of illness or injuries. For example, you can give advice on how to treat minor cuts, what to do in case of a fever, or how to handle a sprained ankle. However, if a question is too complex or requires professional medical knowledge, you must respond with: "Cette situation nécessite l'attention d'un professionnel de la santé qualifié. Veuillez contacter un médecin ou vous rendre à l'établissement médical le plus proche." Always prioritize safety and the necessity of seeking professional medical advice when needed.`
        },
        {
            "role": "user",
            "content": ask
        }

        ]
    })

    res.send(gptResponse.choices[0].message.content)*/
})

