// config/index.js
const dotenv = require("dotenv");
dotenv.config();

// Acts as a loader to select the correct configuration file based on the environment

const environment = process.env.NODE_ENV || "development";

const config = require(`./${environment}`);

module.exports = config;
