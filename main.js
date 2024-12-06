const { app, BrowserWindow, ipcMain, nativeImage, Tray } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Create a window for your web interface
let win;

function createWindow() {
    // win = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     resizable: false,
    //     icon: path.join(__dirname, 'icon.png'), // Use the icon for the app window
    //     webPreferences: {
    //         nodeIntegration: true, // Allow Node.js integration in the renderer process
    //     },
    // });

    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Load the preload.js
            nodeIntegration: false, // Disable node integration for security
        },
    });
    

    win.loadFile('ui.html'); // Load the HTML file

    win.on('closed', () => {
        win = null;
    });
}

// Shutdown function triggered by the timer
ipcMain.handle('shutdown', () => {
    const shutdownCommand = 'shutdown /s /f /t 0'; // Windows shutdown command
    exec(shutdownCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

app.whenReady().then(() => {
    createWindow();

    // Create a system tray icon (optional, can be removed if you don't want it)
    const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
    const tray = new Tray(trayIcon);
    tray.setToolTip('Shutdown Timer App');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
