import Module from './Module.js'
import './App.css';

export default function ModuleHandler() {
    return (
        <div className="module-container">
            <div className="row"> {/* row could be a component that renders x amount of modules based on props, module container could do the same thing rendering x rows of x modules*/}
                <Module
                    purpose="notes"
                    title="Notes" />
                <Module
                    purpose="kanban"
                    title="Kanban Board" />
                <Module
                    purpose="reflective"
                    title="Reflective Journal" />
            </div>
            <div className="row">
                <Module
                    purpose="wireframe"
                    title="Wireframes" />
                <Module
                    purpose="gitStatus"
                    title="Git Status" />
                <Module
                    purpose="aiChat"
                    title="Chat With AI" />
            </div>
        </div>)
}