import './css/App.css';
import './css/Sidebar.css'
import Module from './Module';
import ModuleHandler from './ModuleHandler';
import { useState } from "react";


function App() {
  // default config during testing
  // row implementation is temporary, that'll be automatically configured based on module count and or settings
  let startingModules = [
    <div key="row-1" className="row">
      <Module key="-1" purpose="Notes" title="Notes" />
      <Module key="-2" purpose="Kanban" title="Kanban Board" />
      <Module key="-3" purpose="Reflective" title="Reflective Journal" />
    </div>,
    <div key="row-" className="row">
      <Module key="-4" purpose="Wireframe" title="Wireframes" />
      <Module key="-5" purpose="GitStatus" title="Git Status" />
      <Module key="-6" purpose="AiChat" title="Chat With AI" />
    </div>
  ]

  const [moduleList, setModuleList] = useState(startingModules);
  const [modulesCreated, setModulesCreated] = useState(0);

  // Adds a notes module to the array that gets rendered in ModuleHandler
  function addModule(moduleType) {
    setModuleList([...moduleList, <Module key={modulesCreated} purpose={moduleType} />])
    setModulesCreated(modulesCreated + 1);
    console.log(moduleList);
    console.log(modulesCreated)
  }

  // Sidebar for controlling the main application
  function Sidebar() {
    return (
      // these buttons could check how many in row, if already 3 create new row, else add to existing row
      // close/open side bar buttons should probablu just be chevrons (<>)

      <div className="Sidebar">
        <button>Close Sidebar</button>
        <button onClick={() => { addModule("Notes") }}>Add Notes</button>
        <button onClick={() => { addModule("Kanban") }}>Add Kanban</button>
      </div>
    )
  }


  return (
    <>
      <main className="container">
        <Sidebar />
        <ModuleHandler moduleList={moduleList} />
      </main>
      {/* <Timers /> */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
