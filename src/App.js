import './css/App.css';
import './css/Sidebar.css'
import Module from './Module';
import ModuleHandler from './ModuleHandler';
import { useState } from "react";


function App() {
  // [stateVariable, functionToUpdateState] = useState(defaultValue)
  let [modulesCreated, updateModulesCreated] = useState(0)
  let [moduleList, updateModuleList] = useState([
    <Module key="-1" purpose="notes" title="Notes" />,
    <Module key="-2" purpose="kanban" title="Kanban Board" />
  ]);

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
