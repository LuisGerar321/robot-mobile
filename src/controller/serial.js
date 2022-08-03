const { config } = require("../config");

let connection; 

const {
    arduinoRead,
    arduinoWrite,
    getSerialPort,
    connectSerialPort,
    PID,
    listSerialPorts,
  } = require("../services/arduinoCommunication");

const readSerial =  (req, res) => {
    const readSerial = arduinoRead();
    
    res.status(200).send({status: 200, message: "You got a message", data: readSerial});
}

const writeSerial = (req, res) => {
    const body = req.body;
    try {
        arduinoWrite(body);
        res.status(201).send({status: 201, message: "Publish sucessfully", data: body});
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        })
    }
};

const PD_Controll = (req, res) => {
    const body = req.body;
    try {
        PID(body, arduinoRead());
        res.status(201).send({status: 201, message: "Publish sucessfully", data: body});
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        })
    }
}
const listAllSerial =  async (req, res) => {
    const list =  await listSerialPorts(); 
    res.send({
        status: 200,
        message:"All ports",
        data: list,
    });
}

const readInfoSerial = async (req, res) => {
    const path = await getSerialPort(config.microControllerBoard);
    res.status(200).send({
        status: 200,
        message: `${config.microControllerBoard} Serial port at ${path.path}`,
        data: path.path,
    })
};

const connectSerial = async (req, res) => {
    const microController = await getSerialPort(config.microControllerBoard);
    if (!connection) {
        connection = connectSerialPort(microController.path)
        res.status(201).send({status: 201, message: `${config.microControllerBoard} Serial port communication  was stablished sucesfully at Port ${microController.path}`, data: microController})
    }else {
        res.status(201).send({status: 201, message: `${config.microControllerBoard} Serial port communication  was stablished sucesfully at Port ${microController.path}`, data: microController})
    }  
}

module.exports = { readInfoSerial, writeSerial, readSerial, connectSerial, listAllSerial };