import './App.css';
import './Sidebar.css'
import Module from './Module';
import ModuleHandler from './ModuleHandler';
import { useState} from "react";


function App() {

  let [modulesCreated, updateModulesCreated] = useState(0)
  let [moduleList, updateModuleList] = useState([
    <Module key="-1" purpose="notes" title="Notes" />,
    <Module key="-2" purpose="kanban" title="Kanban Board" />
  ]);

  function addNotes() {
    updateModuleList([...moduleList,<Module key={modulesCreated} purpose="notes" title="Notes" />])

    updateModulesCreated((modulesCreated) => modulesCreated +=1) 
    console.log(moduleList);
    console.log(modulesCreated)
  }

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
    <div className="container">
      <Sidebar />
      <ModuleHandler moduleList={moduleList} />
    </div>
  );
}

export default App;
