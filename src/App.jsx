import './css/App.css';
import './css/Sidebar.css'
import './css/ModuleHandler.css'
import Module from './Module';
import { useState, useEffect, useRef } from "react";
import NoteContent from './noteContent';


export default function App() {
  // default config during testing
  // row implementation is temporary, that'll be automatically configured based on module count and or settings

  const [moduleList, setModuleList] = useState([]);
  // // Data decoupled from modules at this level because otherwise every component is re-rendered whenever data changes
  // // This way each component "controls" itself and updates the global data for backup
  const globalModuleData = useRef({});
  // const [globalData, setGlobalData] = useState([]);

  // Empty dependencies, triggers once, when modules are loaded from local storage or elsewhere, before this code, this wont trigger
  useEffect(() => {
    if (moduleList.length === 0) {
      console.log("!!!!!!!!!!!!!!!!!USE EFFECT TRIGGERED!!!!!!!!!!!!!!!!!!!");
      const defaultModules = ["Notes", "Todo", "Kanban", "Reflective", "Writeframe", "Gitstatus", "AiChat"];

      const startingModuleList = defaultModules.map((moduleType) => {
        const moduleKey = self.crypto.randomUUID();
        return { key: moduleKey, purpose: moduleType }
      }
      )

      for (let i of startingModuleList) {
        globalModuleData.current[i.key] = { purpose: i.purpose, data: undefined };
        console.log(globalModuleData);
      }

      console.log("MODULES", startingModuleList, "GLOBAL DATA", globalModuleData.current);
      setModuleList(startingModuleList);
    }
  }, [])

  console.log(globalModuleData);

  // function setModuleData(iKey, iValue) {
  //   // For everything in the module list, if the key matches the input update that objects data, otherwise it stays the same
  //   setModuleList((prev) =>
  //     prev.map((mod) => mod.key === iKey ? { ...mod, data: iValue } : mod))
  // }

  function setModuleData(iKey, iValue) {
    console.log("!!!!!!!!!!!!!!!!! setModuleData !!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);


    // For everything in the module list, if the key matches the input update that objects data, otherwise it stays the same
    // globalModuleData.current  ((prev) =>
    //   prev.map((mod) => mod.key === iKey ? { ...mod, data: iValue } : mod))

    // globalModuleData.current = globalModuleData.current.map((mod) => mod.key === iKey ? { ...mod, data: iValue } : mod)
    globalModuleData.current[iKey].data = iValue;
    console.log(globalModuleData.current);

  }

  function addModule(moduleType) {
    console.log("!!!!!!!!!!!!!!!!!ADD MODULE!!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);

    const moduleKey = self.crypto.randomUUID()
    console.log(globalModuleData.current);

    // globalModuleData.current = [...globalModuleData.current, { key: moduleKey, purpose: moduleType, data: undefined }]
    globalModuleData.current[moduleKey] = { purpose: moduleType, data: undefined }
    console.log(globalModuleData.current);


    setModuleList(() => [...moduleList, { key: moduleKey, purpose: moduleType }])
    console.log(globalModuleData.current);

    // console.log(moduleList);
  }

  function deleteModule(target) {
    console.log("!!!!!!!!!!!!!!!!! deleteModule !!!!!!!!!!!!!!!!!!!");
    console.log(globalModuleData.current);


    console.log("InDelete");
    console.log(moduleList);
    console.log(target);
    console.log(moduleList[0].key)
    setModuleList((modList) => modList.filter((module) => module.key !== target))
    console.log(moduleList);

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
      // these buttons could check how many in row, if already 3 create new row, else add to existing row
      // close/open side bar buttons should probablu just be chevrons (<>)

      <div className="sidebar">
        <button>Close Sidebar</button>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Todo") }}>Add To-do</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
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

