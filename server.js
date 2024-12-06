const express = require('express');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const port = 3000;

app.use(express.json());

// Endpoint to handle the shutdown request
app.post('/shutdown', (req, res) => {
    try {
        let shutdownCommand;

        // Check the OS and decide which command to use
        if (os.platform() === 'win32') {
            shutdownCommand = 'shutdown /s /f /t 0'; // Windows shutdown command
        } else if (os.platform() === 'darwin') {
            shutdownCommand = 'sudo shutdown -h now'; // macOS shutdown command
        } else if (os.platform() === 'linux') {
            shutdownCommand = 'sudo shutdown -h now'; // Linux shutdown command
        } else {
            return res.status(400).send('Unsupported operating system');
        }

        // Execute the shutdown command
        exec(shutdownCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Failed to initiate shutdown');
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).send('Failed to initiate shutdown');
            }

            console.log(`stdout: ${stdout}`);
            res.status(200).send('Shutdown initiated successfully');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
