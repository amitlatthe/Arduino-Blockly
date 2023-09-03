const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 8080;
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public')); // Serve static files (e.g., HTML, CSS, JS)

app.post('/convert', upload.single('sketch'), (req, res) => {
  const sketchCode = req.file.buffer.toString();
  console.log(sketchCode);
  const boardFQBN = 'arduino:avr:uno'; // Change this to match your board
  const sketchFilePath = 'output/output.ino';
  const hexFilePath = 'output/output.ino.hex';

  fs.writeFileSync(sketchFilePath, sketchCode);

  //runCommand('arduino-cli compile output/output.ino -b arduino:avr:uno --output-dir ./output')
  //runCommand(`avrdude -p atmega328p -c arduino -P ${port} -b 9600 -U flash:w:output/output.ino.hex:i`)

  //exec(`arduino-cli compile ${sketchFilePath} -b ${boardFQBN} --output-dir ./output`, (error, stdout, stderr) => {
exec(`arduino-cli compile ${sketchFilePath} -b ${boardFQBN} --output-dir ./output`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send(`Error compiling sketch: ${error.message}`);
      return;
    }

    // Read the generated hex file and send it as a response
    fs.readFile(hexFilePath, (err, hexData) => {
      if (err) {
        console.error(`Error reading hex file: ${err.message}`);
        res.status(500).send(`Error reading hex file: ${err.message}`);
        return;
      }

      res.set('Content-Type', 'text/plain');
      console.log(hexData);
      res.set('Access-Control-Allow-Origin', '*');
      res.send(hexData);
    });
  });
});

// function runCommand(command) {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Command execution error: ${error}`);
//       } else {
//         console.log(`Command output:\n${stdout}`);
//       }
//     });
//   }


app.get('/', (req, res) => {
    res.send('NoDe cOmpILes aRduiNo seRveR working');
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
