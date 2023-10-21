import { useState, useEffect } from "react";

export default function Module(props) {
    console.log(props);
    let [open, updateOpen] = useState(true);
    function checkStatus() {
        if (open) {
            return (<div className="module">
                <div className="menu-bar">
                    {console.log(props.title)}
                    <p className="module-title">{props.title}</p>
                    <button onClick={closeMod} className="close-module">X</button>
                </div>
                <div className="module-body">
                    {componentPurpose(props.purpose)}
                </div>
            </div>)
        }
    }

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
        checkStatus()
    )
}