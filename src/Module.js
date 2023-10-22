import { useState} from "react";
import './css/Module.css'

export default function Module(props) {
    // console.log(props);
    let [open, updateOpen] = useState(true);
    function checkStatus() {
        // only returns modules with open === true
        if (open) {
            return (<div className="module">
                <div className="menu-bar">
                    {/* {console.log(props.title)} */}
                    <p className="module-title">{props.title}</p>
                    <button onClick={closeMod} className="close-module">X</button>
                </div>
                <div className="module-body">
                    {componentPurpose(props.purpose)}
                </div>
            </div>)
        }
    }

    // toggle open - this can be used for minimising modules to just the menu bar too
    function closeMod() {
        updateOpen(open => !open)
    }

    function componentPurpose(purpose){
        // probably check purpose in a dict, one side component names and one components, each component in its own file

        if (purpose=="notes"){
            // return(<input type="text" placeholder="Text here">js</input>)
            return (<textarea
            type="text"
            placeholder="Text here"/>)
        }
    }

    return (
        // Only returns anything if checkstatus passes
        checkStatus()
    )
}