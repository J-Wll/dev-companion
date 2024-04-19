import './css/App.css';
import './css/Sidebar.css'
import './css/ModuleHandler.css'

import Module from './Module';
import defaultWorkspace from "./assets/Default Workspace.json";
import ErrorBoundary from './small-components/ErrorBoundary';
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [moduleList, setModuleList] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [rowCreate, setRowCreate] = useState(false);

  // Data decoupled from modules at this level because otherwise every component is re-rendered whenever data changes
  // This way each component "controls" itself and updates the global data for saving/loading
  // This usage isn't pure and causes duplications in strict mode, but it is the only solution that has worked so far
  // Everything is accessed using unique keys so duplication while in strict mode should not cause issues
  const globalModuleData = useRef({});

  function nodeCreateFolderSync(folderName) {
    // Creates a folder at __dirname + arg. Uses code in preload.js and main.js (inside electron folder)
    window.electron.createFolder(folderName);
  }


  function nodeReadFileSync(filePath) {
    return window.electron.readFile(filePath);
  }

  function nodeWriteFileSync(filePath, content) {
    window.electron.writeFile(filePath, content);
  }

  function nodeRenameFileSync(filePath, newFilePath) {
    window.electron.renameFile(filePath, newFilePath);
  }

  function nodeDeleteFileSync(filePath) {
    window.electron.deleteFile(filePath);
  }

  function nodeGetWorkspaces() {
    return window.electron.getWorkspaces();
  }

  function nodeGetFilepath() {
    return window.electron.getFilepath();
  }

  const nodeFunctions = {
    nodeGetFilepath, nodeGetWorkspaces, nodeReadFileSync
  }


  function updateLatestWorkspace(newest) {
    nodeWriteFileSync("data/config.json", JSON.stringify({ "latestWorkspace": newest }));
  }

  // console.log(nodeFunctions.nodeGetFilepath());
  function loadWorkspace(name) {
    nodeGetWorkspaces().then((workspaces) => {
      // if that workspace exists
      if (workspaces.find((workspace) => workspace === name)) {
        nodeReadFileSync(`data/workspaces/${name}`).then((resolvedData) => {
          globalModuleData.current = JSON.parse(resolvedData);
          let newModuleList = [];
          for (const mod of Object.keys(globalModuleData.current)) {
            if (globalModuleData.current[mod].purpose) {
              newModuleList.push({ key: mod, purpose: globalModuleData.current[mod].purpose })
            }
          }

          if (!globalModuleData.current.name) {
            globalModuleData.current.name = `default-name-${self.crypto.randomUUID()}`
          }

          setModuleList(newModuleList);
          updateLatestWorkspace(globalModuleData.current.name);
          nodeWriteFileSync(`data/workspaces/${globalModuleData.current.name}.json`, JSON.stringify(globalModuleData.current));
          triggerRefresh(!refresh);
        })
      }
    })
  }

  // Empty dependencies, triggers once, when modules are loaded from storage, before this code, this wont trigger
  useEffect(() => {
    nodeCreateFolderSync("data");
    nodeCreateFolderSync("data/workspaces");
    nodeCreateFolderSync("data/text");

    nodeWriteFileSync("data/workspaces/!defaultWorkspace.json", JSON.stringify(defaultWorkspace));

    const config = nodeReadFileSync("data/config.json");
    config.then((res) => {
      const parsed = JSON.parse(res);
      if (parsed.latestWorkspace) {
        loadWorkspace(`${parsed.latestWorkspace}.json`);
      }
      else if (!globalModuleData.current.name) {
        loadWorkspace("!defaultWorkspace.json");
      }
    }).catch((err) => {
      console.error(err);
      if (!globalModuleData.current.name) {
        loadWorkspace("!defaultWorkspace.json");
      }
    })
  }, [])

  function setModuleData(iKey, iValue, subset = "data") {
    globalModuleData.current[iKey][subset] = iValue;


    // console.log(globalModuleData.current.name);
    // TODO: Write file optimisation, some kind of batch updating
    nodeWriteFileSync(`data/workspaces/${globalModuleData.current.name}.json`, JSON.stringify(globalModuleData.current));
    // console.log(globalModuleData.current.name);

  }

  function topZIndex() {
    let mods = Object.keys(globalModuleData.current)
    mods = mods.filter((mod) => globalModuleData.current[mod].zIndex)
    mods = mods.sort((a, b) => {
      if (globalModuleData.current[a].zIndex && globalModuleData.current[b].zIndex) {
        if (globalModuleData.current[a].zIndex > globalModuleData.current[b].zIndex) {
          return 1
        };
        if (globalModuleData.current[a].zIndex < globalModuleData.current[b].zIndex) {
          return -1
        };
      }
      return 0
    });

    mods.forEach((val, ind) => {
      // console.log(val, ind + 1, globalModuleData.current[val].zIndex, globalModuleData.current[val].purpose)
      globalModuleData.current[val].zIndex = ind + 1;
      // console.log(val, ind, globalModuleData.current[val].zIndex)
    })

    triggerRefresh(!refresh);
  }


  function addModule(moduleType) {

    function sizeToNum(i) {
      return Number(i.substring(0, i.length - 2));
    }

    const moduleKey = self.crypto.randomUUID();
    let defaultPos = { x: 0, y: 10 }

    if (rowCreate) {
      // a system for setting the default position to not overlap. Wasn't initially going to exist but without it keyboard only users can't really use the program. Temporary solution to accessible draggability.
      console.log(globalModuleData, screen.width, screen.height, window.innerWidth, window.innerHeight);
      const modKeys = Object.keys(globalModuleData.current);
      console.log(modKeys)
      // 1 is name, 2 means a module already exists
      if (modKeys.length >= 2) {
        let xSize = 0, ySize = 10, biggestY = 10;
        for (const mod of modKeys) {
          if (globalModuleData.current[mod].purpose) {
            xSize += sizeToNum(globalModuleData.current[mod].size.sizeX) + 15;
            const modYSize = sizeToNum(globalModuleData.current[mod].size.sizeY) + globalModuleData.current[mod].pos.y;
            if (modYSize > biggestY) {
              biggestY = modYSize;
            }

            // 500 for module size, 300 for sidebar size and etc
            if (xSize + 400 > screen.width - 300) {
              ySize = biggestY + 20;
              xSize = 0;
            }
          }
        }
        defaultPos.x = xSize;
        defaultPos.y = ySize;
      }
    }


    globalModuleData.current[moduleKey] = { purpose: moduleType, data: undefined, zIndex: 1001, pos: defaultPos };
    setModuleList(() => [...moduleList, { key: moduleKey, purpose: moduleType }]);
    topZIndex();
  }

  function deleteModule(target) {
    setModuleList((modList) => modList.filter((module) => module.key !== target))
    delete globalModuleData.current[target];
  }

  function getModuleList() {
    return moduleList.map((module) =>
      <Module key={module.key} counter={module.key} purpose={module.purpose} data={module.data} setData={setModuleData} deleteModule={deleteModule} dataFromGlobal={globalModuleData.current[module.key]} topZIndex={topZIndex} />
    )
  }

  // Sidebar for controlling the main application
  function Sidebar() {
    return (
      // These buttons could check how many in row, if already 3 create new row, else add to existing row
      // TODO: Close/open side bar buttons should probablu just be chevrons (<>)

      <div className="sidebar">
        <WorkspaceController />
        <div className='row-create-inp'>
          <label htmlFor="rowCreateCheckbox">Create modules in rows?</label>
          <input id="rowCreateCheckbox" type="checkbox" defaultChecked={rowCreate} onChange={() => { setRowCreate(!rowCreate) }} />
        </div>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Reflective") }}>Add Reflective</button>
        <button onClick={() => { addModule("Todo") }}>Add To-do</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
        <button onClick={() => { addModule("Timer") }}>Add Timer</button>
        <button onClick={() => { addModule("Resources") }}>Add Resources</button>
      </div>
    )
  }

  function WorkspaceController() {
    const [options, setOptions] = useState([<option>loading</option>]);
    const [renameMode, setRenameMode] = useState(false);
    const renameRef = useRef();
    const selectRef = useRef();

    let renameControls;
    if (renameMode) {
      renameControls =
        <div className='workspace-selector'>
          <label htmlFor='rename-input'>New name:</label>
          <input name="rename-input" ref={renameRef}></input>
          <button onClick={() => renameWorkspace(renameRef.current.value)}>Apply</button>
        </div>
    }

    useEffect((() => {
      nodeGetWorkspaces().then((val) => {
        setOptions(val.map((option, index) => {
          let selected;
          if (option === `${globalModuleData.current.name}.json`) {
            selected = "selected"
          }
          return <option key={index} selected={selected} value={option}>{option}</option>
        }))
      });
      // console.log(selectRef.current.selectedOptions[0].innerText)
    }), [])

    // Load workspace defined higher up

    function createWorkspace() {
      const name = `new-workspace-${crypto.randomUUID()}`
      nodeWriteFileSync(`data/workspaces/${name}.json`, JSON.stringify({ "name": name }))
      loadWorkspace(`${name}.json`);
    }

    function clearWorkspace() {
      setModuleList([]);
      globalModuleData.current = { "name": globalModuleData.current.name }
    }

    function renameWorkspace(name) {
      // console.log(`${name}.json`);
      nodeRenameFileSync(`data/workspaces/${globalModuleData.current.name}.json`, `data/workspaces/${name}.json`);
      globalModuleData.current.name = name;
      updateLatestWorkspace(globalModuleData.current.name);
      setRenameMode(false);
      triggerRefresh(!refresh);
    }

    function deleteWorkspace(name) {
      nodeDeleteFileSync(`data/workspaces/${name}`);
      clearWorkspace();
    }

    function saveBackup() {
      const a = document.createElement("a");
      const file = new Blob([JSON.stringify(globalModuleData.current)]);
      a.href = URL.createObjectURL(file);
      a.download = `${globalModuleData.current.name}.json`;
      a.click();
    }

    // console.log(nodeGetWorkspaces(), typeof nodeGetWorkspaces(), "ff");

    return (
      <div className="workspace-selector">
        <label htmlFor="workspace-input">Select workspace:</label>
        <select ref={selectRef} name="workspace-input" id="workspace-input" >
          {options}
        </select>
        {renameControls}
        <div>
          <button onClick={createWorkspace}>Create</button>
          <button onClick={() => setRenameMode(!renameMode)}>Rename</button>
        </div>
        <div>
          <button onClick={() => loadWorkspace(selectRef.current.selectedOptions[0].innerText)}>Load</button>
          <button onClick={clearWorkspace}>Clear</button>
          <button onClick={() => deleteWorkspace(selectRef.current.selectedOptions[0].innerText)}>Delete</button>
        </div>
        <button onClick={saveBackup}>Save backup</button>
      </div>
    )
  }

  function ModuleHandler() {
    // console.log(getModuleList());
    return (
      <div className="module-container">
        {getModuleList()}
      </div>)
  }


  return (
    <>
      <main className="container">
        <Sidebar />
        <ErrorBoundary fallback={<p>Something went wrong with a module. Try loading a new workspace/clearing the workspace and refreshing</p>} >
          <ModuleHandler />
        </ErrorBoundary>
      </main>
    </>
  );
}

