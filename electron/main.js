import { app, BrowserWindow, contentTracing, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

// Fix for __dirname issues after building
const appPath =
  app.isPackaged
    ? `${process.resourcesPath}`
    : __dirname;

// event handling to use node js
ipcMain.handle("createFolder", async (_, fileName) => {
  console.log("Creating file", _, fileName);
  if (fileName) {
    console.log(app.isPackaged, process.env.NODE_ENV);
    console.log(appPath, fileName, path.join(appPath, fileName))
    fs.mkdirSync(path.join(appPath, fileName));
  }
});

ipcMain.handle("readFile", async (_, fileName) => {
  if (fileName) {
    try {
      const data = fs.readFileSync(path.join(appPath, fileName), 'utf8');
      console.log(data);
      return data;
    }
    catch (err) {
      console.log(err);
    }
  }
})

ipcMain.handle("writeFile", async (_, fileName, content) => {
  fs.writeFileSync(path.join(appPath, fileName), content);
})

ipcMain.handle("countWorkspaces", async (_) => {
  const workspaces = fs.readdirSync(path.join(appPath, "data/workspaces")).filter(file => {
    return path.extname(file).toLowerCase() === ".json";
  })
  console.log(workspaces);
  return workspaces;
})

let win
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
