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

  // Empty dependencies, triggers once, when modules are loaded from storage, before this code, this wont trigger
  useEffect(() => {
    if (moduleList.length === 0) {
      console.log("!!!!!!!!!!!!!!!!!USE EFFECT TRIGGERED!!!!!!!!!!!!!!!!!!!");
      const defaultModules = ["Notes", "Todo", "Kanban", "Reflective", "Writeframe", "Gitstatus", "AiChat"];

      const startingModuleList = defaultModules.map((moduleType) => {
        const moduleKey = self.crypto.randomUUID();
        globalModuleData.current[moduleKey] = { purpose: moduleType, data: undefined };
        return { key: moduleKey, purpose: moduleType }
      })

      console.log("MODULES", startingModuleList, "GLOBAL DATA", globalModuleData.current);
      setModuleList(startingModuleList);
    }
  }, [])

  function setModuleData(iKey, iValue) {
    console.log("!!!!!!!!!!!!!!!!! setModuleData !!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);
    globalModuleData.current[iKey].data = iValue;
    console.log(globalModuleData.current);

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
      <Module key={module.key} counter={module.key} purpose={module.purpose} data={module.data} setData={setModuleData} deleteModule={deleteModule} dataFromGlobal={globalModuleData.current[module.key].data} />
    )
  }

  // Sidebar for controlling the main application
  function Sidebar() {
    return (
      // These buttons could check how many in row, if already 3 create new row, else add to existing row
      // Close/open side bar buttons should probablu just be chevrons (<>)

      <div className="sidebar">
        <button>Close Sidebar</button>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Todo") }}>Add To-do</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
        <button onClick={() => { addModule("Timers") }}>Add Timers</button>
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

