import { useState } from "react";
import './css/Module.css'

export default function Module(props) {
    // console.log(props);

    function componentPurpose(purpose) {
        // probably check purpose in a dict, one side component names and one components, each component in its own file 
        if (purpose === "Notes") {
            // Later this should return NotesContent component
            return (
                <textarea
                    type="text"
                    placeholder="Text here" />
            )
        }
    }

    return (
        <div className="module">
            <div className="menu-bar">
                {/* {console.log(props.title)} */}
                <p className="module-title">{props.purpose}</p>
                <button onClick={() => props.deleteModule(props.counter)} className="close-module">X</button>
            </div>
            <div className="module-body">
                {componentPurpose(props.purpose)}
            </div>
        </div>
    )
}