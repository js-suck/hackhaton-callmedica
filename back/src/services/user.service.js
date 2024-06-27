const Error = require("sequelize").Error;
const User = require("../models/user.model");
const UserReports = require("../models/userReport.model");
require("dotenv-flow").config();
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
class UserService {
    static async getUsers() {
        return await User.findAll();
    }

    static async getUserReport(userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const userReports = await UserReports.findAll({ where: { userId }, order: [["updatedAt", "DESC"]]});

        const filterReports = (type) => {
            return userReports
                .filter((report) => report.typeOfReport === type)
                .map((report) => ({
                    id: report.id,
                    value: report.report,
                    generatedByAI: report.isGenerateByAI,
                }));
        };

        const userReport = {
            userInfo: {
                id: { value: user.id, generatedByAI: false },
                firstname: { value: user.firstname, generatedByAI: false },
                lastname: { value: user.lastname, generatedByAI: false },
                email: { value: user.email, generatedByAI: false },
                location: { value: user.location, generatedByAI: false },
                birthDate: { value: user.birthDate, generatedByAI: false },
                currentAddress: { value: user.currentAddress, generatedByAI: false },
            },
            possibleDiseases: filterReports("possibleDiseases"),
            discoveredDisease: filterReports("discoveredDisease"),
            medicalHistory: filterReports("medicalHistory"),
            currentTreatment: filterReports("currentTreatment"),
            remark: filterReports("remark"),
        };
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `Tu dois faire un résumé de donnée patient, le but est de rendre tous les informations du patient avec des phrases pas une liste (userInfo, possibleDiseases, discoveredDisease, medicalHistory, currentTreatment, remark) plus accéssible pour des médecins ou infermieres qui voudrais visionner la fiche de leurs patients`
                },
                {
                    "role": "user",
                    "content": JSON.stringify(userReport)
                }
            ]
        });
        const gptSummary = gptResponse.choices[0].message.content;

        userReport.resume = { value: gptSummary, generatedByAI: true };
        return userReport;
    }

    static async updateUserReports(userId, reportData) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Update user information
        await user.update({
            firstname: reportData.userInfo.firstname.value,
            lastname: reportData.userInfo.lastname.value,
            email: reportData.userInfo.email.value,
            location: reportData.userInfo.location.value,
            birthDate: reportData.userInfo.birthDate.value,
            currentAddress: reportData.userInfo.currentAddress.value,
        });

        // Helper function to update or create reports
        const updateReports = async (type, reports) => {
            const updatePromises = reports.map(async (update) => {
                if (update.id) {
                    await UserReports.update({
                        report: update.value,
                        isGenerateByAI: update.generatedByAI,
                    }, { where: { id: update.id } });
                } else {
                    await UserReports.create({
                        userId,
                        typeOfReport: type,
                        report: update.value,
                        isGenerateByAI: update.generatedByAI,
                    });
                }
            });

            await Promise.all(updatePromises);
        };

        // Update each type of report
        await updateReports("possibleDiseases", reportData.possibleDiseases);
        await updateReports("discoveredDisease", reportData.discoveredDisease);
        await updateReports("medicalHistory", reportData.medicalHistory);
        await updateReports("currentTreatment", reportData.currentTreatment);
        await updateReports("remarks", reportData.remarks);

        return { message: "User and reports updated successfully" };
    }
}

module.exports = UserService;