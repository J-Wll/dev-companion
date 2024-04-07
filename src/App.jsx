import './css/App.css';
import './css/Sidebar.css'
import './css/ModuleHandler.css'

import Module from './Module';
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [moduleList, setModuleList] = useState([]);

  // Data decoupled from modules at this level because otherwise every component is re-rendered whenever data changes
  // This way each component "controls" itself and updates the global data for saving/loading
  // This usage isn't pure and causes duplications in strict mode, but it is the only solution that has worked so far
  // Everything is accessed using unique keys so duplication while in strict mode should not cause issues
  const globalModuleData = useRef({});

  async function createFolder(folderName) {
    // Creates a folder at __dirname + arg. Uses code in preload.js and main.js (inside electron folder)
    await window.electron.createFolder(folderName);
  }

  async function nodeReadFileSync(filePath) {
    return await window.electron.readFile(filePath);
  }

  async function nodeWriteFile(filePath, content) {
    window.electron.writeFile(filePath, content);
  }

  // Empty dependencies, triggers once, when modules are loaded from storage, before this code, this wont trigger
  useEffect(() => {
    createFolder("data");
    createFolder("data/workspaces");
    createFolder("data/text");

    const res = nodeReadFileSync("data/workspaces/test.txt");
    console.log(res);
    res.then((resolvedData) => {
      console.log("Resolved data:", resolvedData);
    }).catch((error) => {
      console.error("Error reading file:", error);
    });

    nodeWriteFile("data/text/writeTest.txt", "CONTENT WRITE TEST");

    // TODO: CHECK FOR EXISTING WORKSPACE HERE, LOAD INTO GLOBAL MODULE DATA AND MODULELIST, PLACE INTO A REUSUABLE FUNCTION FOR LOADING OTHER WORKSPACES TOO

    if (!globalModuleData.current.name) {
      globalModuleData.current.name = `default-name-${self.crypto.randomUUID()}`
    }

    if (moduleList.length === 0) {
      console.log("!!!!!!!!!!!!!!!!!USE EFFECT TRIGGERED!!!!!!!!!!!!!!!!!!!");
      const defaultModules = ["Timers", "Notes", "Todo", "Kanban", "Reflective", "Wireframe", "Gitstatus", "AiChat"];

      const startingModuleList = defaultModules.map((moduleType) => {
        const moduleKey = self.crypto.randomUUID();
        globalModuleData.current[moduleKey] = { purpose: moduleType, data: undefined, layout: undefined };
        return { key: moduleKey, purpose: moduleType }
      })

      console.log("MODULES", startingModuleList, "GLOBAL DATA", globalModuleData.current);
      setModuleList(startingModuleList);
    }
  }, [])

  function setModuleData(iKey, iValue, layout = false) {
    // console.log("!!!!!!!!!!!!!!!!! setModuleData !!!!!!!!!!!!!!!!!!!");
    // console.log(globalModuleData.current);
    if (layout) {
      globalModuleData.current[iKey].layout = iValue;
    }
    else {
      globalModuleData.current[iKey].data = iValue;
    }

    let workspaceName = "workspace1";
    nodeWriteFile(`data/workspaces/${workspaceName}.json`, JSON.stringify(globalModuleData.current));
    // console.log(globalModuleData.current);
  }

  function addModule(moduleType) {
    console.log("!!!!!!!!!!!!!!!!!ADD MODULE!!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);

    const moduleKey = self.crypto.randomUUID()

    globalModuleData.current[moduleKey] = { purpose: moduleType, data: undefined }
    setModuleList(() => [...moduleList, { key: moduleKey, purpose: moduleType }])
  }

  function deleteModule(target) {
    console.log("!!!!!!!!!!!!!!!!! deleteModule !!!!!!!!!!!!!!!!!!!");
    setModuleList((modList) => modList.filter((module) => module.key !== target))
    delete globalModuleData.current[target];
  }

  function getModuleList() {
    console.log("!!!!!!!!!!!!!!!!! getModuleList !!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);

    console.log(moduleList);
    return moduleList.map((module) =>
      <Module key={module.key} counter={module.key} purpose={module.purpose} data={module.data} setData={setModuleData} deleteModule={deleteModule} dataFromGlobal={globalModuleData.current[module.key]} />
    )
  }

  // Sidebar for controlling the main application
  function Sidebar() {
    return (
      // These buttons could check how many in row, if already 3 create new row, else add to existing row
      // TODO: Close/open side bar buttons should probablu just be chevrons (<>)

      <div className="sidebar">
        <WorkspaceSelector />
        <button>Close Sidebar</button>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Todo") }}>Add To-do</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
        <button onClick={() => { addModule("Timers") }}>Add Timers</button>
      </div>
    )
  }

  function WorkspaceSelector() {
    return (
      <div className="workspace-selector">
        <label htmlFor="workspace-input">Select workspace:</label>
        {/* TODO: populate with data from data folder, unique name by default and can be renamed */}
        <select name="workspace-input" id="workspace-input" >
          <option value="workspace-1">workspace-1</option>
          <option value="workspace-2">workspace-2</option>
          <option value="workspace-3">workspace-3</option>
          <option value="workspace-4">workspace-4</option>
        </select>
        <div>
          <button>Add</button>
          <button>Rename</button>
        </div>
        <div>
          <button>Load</button>
          <button>Clear</button>
        </div>
      </div>
    )
  }

  function ModuleHandler() {
    console.log(getModuleList());
    return (
      <div className="module-container">
        {getModuleList()}
      </div>)
  }


  return (
    <>
      <main className="container">
        <Sidebar />
        <ModuleHandler />
      </main>
      {/* <Timers /> */}
      {/* <Footer /> */}
    </>
  );
}

