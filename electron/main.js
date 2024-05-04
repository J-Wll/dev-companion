import { app, BrowserWindow, contentTracing, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { shell } from "electron";

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
    // console.log(app.isPackaged, process.env.NODE_ENV);
    // console.log(appPath, fileName, path.join(appPath, fileName))
    try {
      fs.mkdirSync(path.join(appPath, fileName));
    } catch (error) {

    }
  }
});

ipcMain.handle("readFile", async (_, fileName) => {
  if (fileName) {
    try {
      const data = fs.readFileSync(path.join(appPath, fileName), 'utf8');
      // console.log(data);
      return data;
    }
    catch (err) {
      console.log(err);
    }
  }
})

ipcMain.handle("renameFile", async (_, fileName, newFileName) => {
  fs.renameSync(path.join(appPath, fileName), path.join(appPath, newFileName));
});


ipcMain.handle("writeFile", async (_, fileName, content) => {
  fs.writeFileSync(path.join(appPath, fileName), content);
})

ipcMain.handle("deleteFile", async (_, fileName) => {
  fs.unlinkSync(path.join(appPath, fileName));
})

ipcMain.handle("getWorkspaces", async (_) => {
  return fs.readdirSync(path.join(appPath, "data/workspaces")).filter(file => {
    return path.extname(file).toLowerCase() === ".json";
  })
})

ipcMain.handle("getFilepath", (_) => {
  return appPath;
})

ipcMain.handle("openLink", (_, link) => {
  shell.openExternal(link);
})

let win
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 720,
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
