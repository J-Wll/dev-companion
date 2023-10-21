import './App.css';
import Module from './Module.js'

function App() {
  return (
    <div class="container">
      <div class="module-container">
        <div class="row">
          <Module />
          <Module />
          <Module />
        </div>
        <div class="row">
          <Module />
          <Module />
          <Module />
        </div>
      </div>
    </div>
  );
}

export default App;
