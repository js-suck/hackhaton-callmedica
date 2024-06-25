const OpenAI = require('openai');
const db = require('./db/sequelize')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./models/user.model');
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

app.post('/api/ask', async(req, res) => {
    const ask = req.body.ask;
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const gptResponse = await openai.chat.completions.create({
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

    res.send(gptResponse.choices[0].message.content)
})

async function chatWithBot(req, res) {
    const { text } = req.body
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const gptResponse = await openai.chat.completions.create({
        model: "davinci",
        prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: I'd like to cancel my subscription.\nAI:",
        temperature: 0.9,
        maxTokens: 150,
        topP: 1,
        presencePenalty: 0.6,
        frequencyPenalty: 0.0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ["\n", " Human:", " AI:"]
    })

    res.send(gptResponse)
}
