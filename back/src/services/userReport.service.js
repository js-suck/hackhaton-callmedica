const Error = require("sequelize").Error;
const User = require("../models/user.model");
const UserReport = require("../models/userReport.model");
const OpenAI = require("openai");
const OpenAIModule = require("../modules/openai.module"); //
require("dotenv-flow").config();

class UserService {
    async add(userId, typeOfReport, report, isGenerateByAI) {
        const userReport = await UserReport.create({
            userId,
            typeOfReport,
            report,
            isGenerateByAI
        });

        if (!userReport) {
            return Promise.reject(new Error("userReport not created"));
        }

        return userReport;
    }
}

module.exports = UserService;