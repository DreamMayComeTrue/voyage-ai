const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

app.commandLine.appendSwitch('enable-features', 'WebSpeechAPI')
app.commandLine.appendSwitch('allow-http-screen-capture')
// Required flags for speech recognition and mic
app.commandLine.appendSwitch('enable-speech-dispatcher')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('disable-web-security')

function createWindow() {
    // Set permissions BEFORE creating window
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log('[Permission requested]:', permission)
        // Allow all media/mic permissions
        const allowed = [
            'microphone', 'media', 'audioCapture','speech-synthesis',
            'notifications', 'mediaKeySystem', 'geolocation'
        ]
        callback(allowed.includes(permission))
    })

    session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
        const allowed = ['microphone', 'media', 'audioCapture', 'speech-synthesis']
        const result = allowed.includes(permission)
        console.log('[Permission check]:', permission, '→', result)
        return result
    })

    const win = new BrowserWindow({
        width: 390,
        height: 844,
        resizable: true,
        minWidth: 350,
        minHeight: 600,
        frame: true,
        title: 'VoyageAI',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
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

    win.on('page-title-updated', (e) => e.preventDefault())

    // Show DevTools in dev for debugging
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' })
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})