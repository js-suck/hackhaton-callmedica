require('dotenv-flow').config();
const OpenAI = require('openai');
const extractJSON = require('../helpers/extractJSON');

class OpenAIModule {
    constructor() {
        this.openai = new OpenAI(process.env.OPENAI_API_KEY);
    }

    /**
     * Ask ChatGPT
     * @param {string} user Content of the user
     * @param {string} system Content of the system
     * @return {Promise<string>} The response of the AI
     */
    async ask(user, system = 'You are a website that propose cooking recipes', history =  [], jsonOnly = true, fomat = undefined) {
        if (!this.openai) {
            return Promise.reject('OpenAI not initialized');
        }

        if (!system) {
            throw Error('Content for system not specified');
        }

        if (typeof system != 'string') {
            throw Error('Content for system must be a string');
        }

        if(history.length > 0)
        {
            history = history.map(h => {
                return {
                    role: h.role,
                    content: h.content
                }
            })
        }

        const messages = [
            {
                role: "system",
                content: system,
            },
            ...history,
            {
                role: "user",
                content: user,
            },
        ];

        if (jsonOnly) {
            messages.unshift({
                role: "system",
                content: 'You are an assistant that generates JSON. You always return just the JSON with no additional description or context. NEVER return a string. Pas de prose.',
            });
        }

        if(fomat)
        {
            messages.unshift({
                role: "system",
                content: fomat,
            });
        }

        const gptResponse = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: messages,
            response_format: { "type": jsonOnly ? "json_object" : "text" },
        });


        return gptResponse.choices[0].message.content;
    }
}

module.exports = OpenAIModule;