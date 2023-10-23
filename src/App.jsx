import './css/App.css';
import './css/Sidebar.css'
import Module from './Module';
import ModuleHandler from './ModuleHandler';
import { useState } from "react";


function App() {
  // default config during testing
  // row implementation is temporary, that'll be automatically configured based on module count and or settings
  let arr = [];
  let startingModules = [
    <div key="row-1" className="row">
      <Module key="-1" purpose="notes" title="Notes" />
      <Module key="-2" purpose="kanban" title="Kanban Board" />
      <Module key="-3" purpose="reflective" title="Reflective Journal" />
    </div>,
    <div key="row-" className="row">
      <Module key="-4" purpose="wireframe" title="Wireframes" />
      <Module key="-5" purpose="gitStatus" title="Git Status" />
      <Module key="-6" purpose="aiChat" title="Chat With AI" />
    </div>
  ]
  // [stateVariable, functionToUpdateState] = useState(defaultValue)
  let [modulesCreated, updateModulesCreated] = useState(0)
  let [moduleList, updateModuleList] = useState(startingModules);

  // Adds a notes module to the array that gets rendered in ModuleHandler
  function addNotes() {
    updateModuleList([...moduleList, <Module key={modulesCreated} purpose="notes" title="Notes" />])

    updateModulesCreated((modulesCreated) => modulesCreated += 1)
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
        <button onClick={addNotes}>Add Notes</button>
        <button>Add Kanban</button>
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
