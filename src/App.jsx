import './css/App.css';
import './css/Sidebar.css'
import './css/ModuleHandler.css'
import Module from './Module';
import { useState } from "react";
import NoteContent from './noteContent';


export default function App() {
  // default config during testing
  // row implementation is temporary, that'll be automatically configured based on module count and or settings
  let startingModules = [
    { key: self.crypto.randomUUID(), purpose: "Notes", data: undefined },
    { key: self.crypto.randomUUID(), purpose: "Kanban", data: undefined },
    { key: self.crypto.randomUUID(), purpose: "Reflective", data: undefined },
    { key: self.crypto.randomUUID(), purpose: "Wireframe", data: undefined },
    { key: self.crypto.randomUUID(), purpose: "GitStatus", data: undefined },
    { key: self.crypto.randomUUID(), purpose: "AiChat", data: undefined }
  ]

  const [moduleList, setModuleList] = useState(startingModules);

  function setModuleData(iKey, iValue) {
    // For everything in the module list, if the key matches the input update that objects data, otherwise it stays the same
    setModuleList((prev) =>
      prev.map((mod) => mod.key === iKey ? {...mod, data:iValue } : mod))
  }

  function addModule(moduleType) {
    setModuleList([...moduleList, { key: self.crypto.randomUUID(), purpose: moduleType, data: "undefinasded" }])
    console.log(moduleList);
  }

  function deleteModule(target) {
    console.log("InDelete");
    console.log(moduleList);
    console.log(target);
    console.log(moduleList[0].key)
    setModuleList((modList) => modList.filter((module) => module.key !== target))
    console.log(moduleList);

  }

  function getModuleList() {
    console.log(moduleList);
    return moduleList.map((module) =>
      <Module key={module.key} counter={module.key} purpose={module.purpose} deleteModule={deleteModule} data={module.data} setData={setModuleData} />
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

