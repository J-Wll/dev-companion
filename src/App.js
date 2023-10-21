import './App.css';
import Module from './Module';
import Sidebar from './Sidebar';
import ModuleHandler from './ModuleHandler';

function App() {
  return (
    <div className="container">
      <Sidebar/>
      <ModuleHandler/>
    </div>
  );
}

export default App;
