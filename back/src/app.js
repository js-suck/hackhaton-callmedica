const db = require("./db/sequelize");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const UserReportService = require("./services/userReport.service");
const UserReport = require("./models/userReport.model");
const UserTranscriptionService = require('./services/userTranscription.service');
const UserTranscription = require('./models/userTranscription.model');
const userRoutes = require("./routes/user.routes");
require("dotenv-flow").config();
const cors = require("cors");
const PORT = process.env.API_PORT;

const models = db.models;
for (const modelName in models) {
  if (models.hasOwnProperty(modelName)) {
    console.log(`Modèle trouvé : ${modelName}`);
  }
}
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
module.exports = app;