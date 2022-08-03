const {SerialPort, ReadlineParser} = require("serialport");
const { DelimiterParser } = require('@serialport/parser-delimiter')
const { config } = require("../config");
const chalk = require("chalk");

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class PD_Controller {
    error = 0;
    lastError = null;
    uT = 0;
    constructor(setPoint, kp, kd, minError){
        this.setPoint = setPoint;
        this.kp =  kp;
        this.kd = kd;
        this.minError = minError;
    };

    Controll(processValue) {
        this.error =  this.setPoint - processValue;
        this.dError = this.error - this.lastError;
        this.uT = (this.kp * this.error)  + (this.kd * this.dError);
        this.lastError = this.error;
        console.log(this);
        return this.uT;
    };
};

let serialCommunication;
const wheel1Controll = new PD_Controller(0, 80.4, 22.2, 0.1);

var msg = "";


// const parser = serialCommunication.pipe(new ReadlineParser())

const listSerialPorts = async ()  => {
    const allSerialPorts = await SerialPort.list();
    return allSerialPorts;
}

const getSerialPort = async (microControllerName) => {
    try {
        const allSerialPorts = await SerialPort.list();
        const serialPort =  allSerialPorts.find( (currentSerial) => currentSerial.manufacturer.toLocaleLowerCase().includes( microControllerName.toLocaleLowerCase()) && currentSerial.manufacturer !== "undefined");
        return serialPort;
    } catch (err) {
        return err;
    }

}

const connectSerialPort = async (microControllerPORT) => {
    try {
        serialCommunication = new SerialPort({path: microControllerPORT, baudRate: config.BAUDRATE, autoOpen: true, parser: SerialPort.parser }, function (err) {
            if (err) {
              return console.log('Error: ', err.message)
            }
        });

        const parser = serialCommunication.pipe(new ReadlineParser({ delimiter: '\n' }))
        parser.on('data', (data) => {
            msg = data;
            msg = msg.slice(0, msg.indexOf("\r"));
        })

        await serialCommunication.on("open", () => console.log("open!!"))
        return serialCommunication;
    } catch (error) {
        throw error;
    }
}

const arduinoWrite = async (msg) => {
    if (!serialCommunication) throw new Error(`There is not a Serial Connection`);
    await serialCommunication.write(JSON.stringify(msg))

    // //min +- 100;
    // wheel1Controll.setPoint = msg.motor1;
    // setInterval( async () => {
    //     const uTMotor1 = wheel1Controll.Controll(arduinoRead().motor1.RPS);
    //     const scaleUT = map(uTMotor1, 0, 255, 0, 10);

    //     msg.motor1 = scaleUT;
    //     console.log("The msg: ", msg);
    //     await serialCommunication.write(JSON.stringify(msg));
    // }, 100)
}

const arduinoRead = () => {
    if (!serialCommunication) throw new Error(`There is not a Serial Connection`);
    return JSON.parse(msg);
}

module.exports = {
    arduinoWrite,
    arduinoRead,
    getSerialPort,
    connectSerialPort,
    listSerialPorts
};