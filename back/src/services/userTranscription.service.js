const Error = require("sequelize").Error;
const User = require("../models/user.model");
const UserTranscription = require("../models/userTranscription.model");
const OpenAI = require("openai");
const OpenAIModule = require("../modules/openai.module"); //
require("dotenv-flow").config();

class UserTranscriptionService {
    async add(userId, text, fileName) {
        const userTranscription = await UserTranscription.create({
            userId,
            text,
            fileName
        });

        if (!userTranscription) {
            return Promise.reject(new Error("userTranscription not created"));
        }

        return userTranscription;
    }
    async getAll() {
        const userTranscriptions = await UserTranscription.findAll();

        if (!userTranscriptions) {
            return Promise.reject(new Error("userTranscriptions not found"));
        }

        return userTranscriptions;
    }

}

module.exports = UserTranscriptionService;