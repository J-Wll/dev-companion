import { useState, useEffect, useRef } from "react";

import "../css/css-module-content/ResourcesContent.css"
import defaultResources from "../assets/Default Resources.json";

function Resources({ selected, data }) {
    console.log(data.data[selected]);


    // window.electron.openLink("https://stackoverflow.com/questions/73464422/electron-app-how-do-i-open-link-in-browser");
    try {

        const returnVal = data.data[selected].map((item, index) =>
            <li key={index}><a href="#" onClick={() => window.electron.openLink(item.link)}>{item.name}</a> - {item.description}</li>
        )
        return (
            // <></>
            returnVal
        )
    }

    catch (error) {
        console.log(error);
    }
}

export default function ResourcesContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [options, setOptions] = useState([])
    const [refresh, triggerRefresh] = useState(false);

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    if (!localData) {
        let newLocalData = {};
        newLocalData.data = defaultResources;
        newLocalData.selected = "General";

        console.log(newLocalData);
        setLocalData(() => newLocalData);
    }

    useEffect(() => {
        setOptions(Object.keys(defaultResources).map((option, index) => {
            let selected;
            if (option === localData.selected) {
                selected = "selected"
            }
            return <option selected={selected} key={index} value={option}>{option}</option>
        }))
    }, [])

    console.log(localData);

    try {
        return (
            <>
                <div>
                    <label htmlFor="resource-category-input">Select workspace:</label>
                    <select value={localData.selected} onChange={(e) => { setLocalData({ ...localData, selected: e.target.value }) }} name="resource-category-input" id="resource-category-input" >
                        {options}
                    </select>
                    <Resources selected={localData.selected} data={localData} />
                </div>
            </>
        )
    }
    catch (error) {
        console.log(error);
    }

}