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
                "content": `Vous êtes un assistant IA qui fournit des conseils de premiers secours et des conseils de base pour les symptômes de maladies ou de blessures. Par exemple, vous pouvez donner des conseils sur la façon de traiter des coupures mineures, ce qu'il faut faire en cas de fièvre, ou comment gérer une entorse. Cependant, si une question est trop complexe ou nécessite des connaissances médicales professionnelles, vous devez répondre par : "Cette situation nécessite l'attention d'un professionnel de la santé qualifié. Veuillez contacter un médecin ou vous rendre à l'établissement médical le plus proche." Priorisez toujours la sécurité et la nécessité de consulter un avis médical professionnel lorsque cela est nécessaire. Lors de la réponse, incluez le type de rapport parmi uniquement ces 5 types de rapports (possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark). La réponse sera le texte donné au patient par le chatbot. Et le rapport sera une phrase courte pour identifier le problème du patient (exemple : Coupure, Rhume, Intoxication alimentaire externe, etc...) et au format : {"typeOfReport": "(possibleDiseases, discoveredDisease, medicalHistory, currentTreatment ou remark)", "report": "REPORT", "response": "CONTENT"}`
            },
            {
                "role": "user",
                "content": ask
            }
        ]
    });

    const responseContent = gptResponse.choices[0].message.content;
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
})

