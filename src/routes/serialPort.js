const express = require("express");
const { writeSerial, readSerial, readInfoSerial, connectSerial, listAllSerial,PD_Controll  } = require("../controller/serial");

const router = express.Router();

router.get("/", readSerial);
router.get("/config/serialPort", readInfoSerial);
router.get("/config/listSerialPorts", listAllSerial);

router.get("/config/connectSerialPort", connectSerial);
router.post("/",writeSerial);
// router.post("/", PD_Controll);


module.exports = router;