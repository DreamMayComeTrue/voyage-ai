const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow() {
    const win = new BrowserWindow({
        width: 390,
        height: 844,
        resizable: true,
        minWidth: 350,
        minHeight: 600,
        frame: true,
        transparent: false,
        titleBarStyle: 'default',
        title: 'VoyageAI',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'logo192.png')
    })

    win.setMenuBarVisibility(false)

    // Maximize to fit user's screen on launch
    win.maximize()

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )

    win.on('page-title-updated', (e) => {
        e.preventDefault()
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})