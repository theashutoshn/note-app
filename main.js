const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false, // ✅ removes native title bar
        titleBarStyle: 'hidden', // macOS style optional
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true, // Allows require in frontend JS
            contextIsolation: false, // Allows access to Node.js APIs
        },
    });

    // Load your main HTML file
    win.loadFile('index.html');

    Menu.setApplicationMenu(null);

    // Optional: Open DevTools
    // win.webContents.openDevTools();
}

// Called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
