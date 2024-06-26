const Error = require("sequelize").Error;
const User = require("../models/user.model");
const UserReports = require("../models/userReport.model");
require("dotenv-flow").config();

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
            remarks: filterReports("remarks"),
        };
        return userReport;
    }
}

module.exports = UserService;