const { config } = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const serialPort = require("./routes/serialPort");
var cors = require('cors')

// const { getSerialPort, connectSerialPort } = require("./services/arduinoCommunication");
// (async () => {
//   const microController = await getSerialPort(config.microControllerBoard);    
//   const connection = connectSerialPort(microController.path);
// })();

const app = express();
app.use(cors());

const PORT = config.PORT || 3000;



app.use(bodyParser.json());
app.use("/api/arduino", serialPort);
app.get("/api/", serialPort);

app.listen(PORT, () => {
  console.log(`API is listening on port: ${PORT}`);
});