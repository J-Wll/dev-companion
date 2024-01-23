// /// <reference types="vite-plugin-electron/electron-env" />

// pretty sure that is just defining type of enviroment vars
// declare namespace NodeJS {
//   interface ProcessEnv {

//     /**
//      * The built directory structure
//      *
//      * ```tree
//      * ├─┬─┬ dist
//      * │ │ └── index.html
//      * │ │
//      * │ ├─┬ dist-electron
//      * │ │ ├── main.js
//      * │ │ └── preload.js
//      * │
//      * ```
//      */
//     DIST: string;
//     /** /dist/ or /public/ */
//     VITE_PUBLIC: string;
//   }
// }

// process.env{
//   DIST: string,
//   VITE_PUBLIC: string;
// }

// Used in Renderer process, expose in `preload.ts`

Window.import('electron').IpcRenderer;

