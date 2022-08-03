require("dotenv").config();

const path = require("path");

const config = {
    root: path.normalize(`${__dirname}/..`),
    env: process.env.NODE_ENV || "development",
    ARDUINO_COM: process.env.arduinoCOM,
    PORT:  Number(process.env.PORT),
    BAUDRATE: Number(process.env.BAUDRATE),
    microControllerBoard: process.env.MICRO_CONTROLLER_BOARD,
};

module.exports = {config};