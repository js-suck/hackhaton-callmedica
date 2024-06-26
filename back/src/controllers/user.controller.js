const UserService = require('../services/user.service');

const getUserReport = async (req, res) => {
    const { userId } = req.params;
    const userReport = await UserService.getUserReport(userId);
    res.json(userReport);
}

module.exports = {
    getUserReport
};