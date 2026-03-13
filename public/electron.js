const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

// Required for speech recognition in Electron
app.commandLine.appendSwitch('enable-speech-dispatcher')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

function createWindow() {
    // Set permissions BEFORE creating window
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log('Permission requested:', permission)
        const allowed = ['microphone', 'media', 'audioCapture', 'notifications', 'mediaKeySystem']
        callback(allowed.includes(permission))
    })

    session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
        const allowed = ['microphone', 'media', 'audioCapture']
        return allowed.includes(permission)
    })

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
            webSecurity: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            permissions: ['microphone'],
        },
        icon: path.join(__dirname, 'logo192.png')
    })

    win.setMenuBarVisibility(false)
    win.maximize()

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )

    win.on('page-title-updated', (e) => {
        e.preventDefault()
    })

    // Open DevTools to see console logs (remove for production)
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' })
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
