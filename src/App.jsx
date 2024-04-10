import './css/App.css';
import './css/Sidebar.css'
import './css/ModuleHandler.css'

import Module from './Module';
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [moduleList, setModuleList] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState("defaultWorkspace.json");
  const [refresh, triggerRefresh] = useState(false);

  // Data decoupled from modules at this level because otherwise every component is re-rendered whenever data changes
  // This way each component "controls" itself and updates the global data for saving/loading
  // This usage isn't pure and causes duplications in strict mode, but it is the only solution that has worked so far
  // Everything is accessed using unique keys so duplication while in strict mode should not cause issues
  const globalModuleData = useRef({});

  async function nodeCreateFolderSync(folderName) {
    // Creates a folder at __dirname + arg. Uses code in preload.js and main.js (inside electron folder)
    await window.electron.createFolder(folderName);
  }

  async function nodeReadFileSync(filePath) {
    return await window.electron.readFile(filePath);
  }

  async function nodeWriteFileSync(filePath, content) {
    window.electron.writeFile(filePath, content);
  }

  async function nodeRenameFileSync(filePath, newFilePath) {
    window.electron.renameFile(filePath, newFilePath);
  }

  async function nodeGetWorkspaces() {
    return await window.electron.getWorkspaces();
  }

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
          setModuleList(newModuleList);
          setCurrentWorkspace(name);

          if (!globalModuleData.current.name) {
            console.log(globalModuleData.current.name);
            globalModuleData.current.name = `default-name-${self.crypto.randomUUID()}`
            console.log(globalModuleData.current.name);
          }
        })
      }
    })
  }

  // Empty dependencies, triggers once, when modules are loaded from storage, before this code, this wont trigger
  useEffect(() => {
    nodeCreateFolderSync("data");
    nodeCreateFolderSync("data/workspaces");
    nodeCreateFolderSync("data/text");

    const res = nodeReadFileSync("data/workspaces/test.txt");
    console.log(res);
    res.then((resolvedData) => {
      console.log("Resolved data:", resolvedData);
    }).catch((error) => {
      console.error("Error reading file:", error);
    });

    nodeWriteFileSync("data/text/writeTest.txt", "CONTENT WRITE TEST");

    if (!globalModuleData.current.name) {
      loadWorkspace("defaultWorkspace.json");
    }
  }, [])

  function setModuleData(iKey, iValue, layout = false) {
    // console.log("!!!!!!!!!!!!!!!!! setModuleData !!!!!!!!!!!!!!!!!!!");
    // console.log(globalModuleData.current);
    // console.log(moduleList);
    if (layout === "pos") {
      globalModuleData.current[iKey].layout = iValue;
    }
    else if (layout === "size") {
      globalModuleData.current[iKey].size = iValue;
    }
    else {
      globalModuleData.current[iKey].data = iValue;
    }

    // console.log(globalModuleData.current.name);
    // TODO: Write file optimisation, some kind of batch updating
    nodeWriteFileSync(`data/workspaces/${globalModuleData.current.name}.json`, JSON.stringify(globalModuleData.current));
    // console.log(globalModuleData.current.name);

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
        <WorkspaceController />
        <button>Close Sidebar</button>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Reflective") }}>Add Reflective</button>
        <button onClick={() => { addModule("Todo") }}>Add To-do</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
        <button onClick={() => { addModule("Timer") }}>Add Timer</button>
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
          <label>New name:</label>
          <input ref={renameRef}></input>
          <button onClick={() => renameWorkspace(renameRef.current.value)}>Apply</button>
        </div>
    }

    useEffect((() => {
      nodeGetWorkspaces().then((val) => {
        setOptions(val.map((option) => {
          let selected;
          if (option === `${globalModuleData.current.name}.json`) {
            selected = "selected"
          }
          return <option selected={selected} value={option}>{option}</option>
        }))
      });
      console.log(selectRef.current.selectedOptions[0].innerText)
    }), [])

    function loadWorkspaceHandler(name) {
      loadWorkspace(name);
      console.log(globalModuleData.current.name);
    }

    function createWorkspaceHandler() {
      const name = `new-workspace-${crypto.randomUUID()}`
      nodeWriteFileSync(`data/workspaces/${name}.json`, JSON.stringify({ "name": name }))
      loadWorkspace(`${name}.json`);
    }

    function clearWorkspace() {
      setModuleList([]);
      globalModuleData.current = { "name": globalModuleData.current.name }
    }

    function renameWorkspace(name) {
      console.log(`${name}.json`);
      nodeRenameFileSync(`data/workspaces/${globalModuleData.current.name}.json`, `data/workspaces/${name}.json`);
      globalModuleData.current.name = name;
      setRenameMode(false);
      triggerRefresh(!refresh);
    }

    console.log(options, "ff");
    console.log(nodeGetWorkspaces(), typeof nodeGetWorkspaces(), "ff");

    return (
      <div className="workspace-selector">
        <label htmlFor="workspace-input">Select workspace:</label>
        {/* TODO: populate with data from data folder, unique name by default and can be renamed */}
        {renameControls}
        <select ref={selectRef} name="workspace-input" id="workspace-input" >
          {options}
        </select>
        <div>
          <button onClick={createWorkspaceHandler}>Create</button>
          <button onClick={() => setRenameMode(!renameMode)}>Rename</button>
        </div>
        <div>
          <button onClick={() => loadWorkspaceHandler(selectRef.current.selectedOptions[0].innerText)}>Load</button>
          <button onClick={clearWorkspace}>Clear</button>
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
    </>
  );
}

