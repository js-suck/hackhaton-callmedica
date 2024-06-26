const UserService = require('../services/user.service');

const getUsers = async (req, res) => {
    const users = await UserService.getUsers();
    res.json(users);
}

const getUserReport = async (req, res) => {
    const { userId } = req.params;
    const userReport = await UserService.getUserReport(userId);
    res.json(userReport);
}

module.exports = {
    getUsers,
    getUserReport
};