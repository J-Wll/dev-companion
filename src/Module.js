import { useState, useEffect } from "react";

export default function Module(purpose="undefined") {
    console.log(purpose);
    let [open, updateOpen] = useState(true);
    function checkStatus() {
        if (open) {
            return (<div className="module">
                <div className="menu-bar">
                    <button onClick={closeMod} className="close-module">X</button>
                </div>
                <div className="module-body">
                    {componentPurpose(purpose)}
                </div>
            </div>)
        }
    }

    function closeMod() {
        updateOpen(open => !open)
    }

    function componentPurpose(purpose){
        purpose=purpose.purpose;
        // probably check this in a dict, one side component names and one components

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