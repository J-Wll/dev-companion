import './App.css';
import Module from './Module.js'

function App() {
  return (
    <div className="container">
      <div className="module-container">
        <div className="row"> {/* row could be a component that renders x amount of modules based on props, module container could do the same thing rendering x rows of x modules*/}
          <Module
            purpose="notes" />
          <Module
            purpose="kanban" />
          <Module
            purpose="reflective" />
        </div>
        <div className="row">
          <Module
            purpose="wireframe" />
          <Module
            purpose="gitTrack" />
          <Module
            purpose="aiChat" />
        </div>
      </div>
    </div>
  );
}

export default App;
