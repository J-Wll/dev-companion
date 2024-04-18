import { useState, useEffect, useRef } from "react";

import "../css/css-module-content/ResourcesContent.css"
import defaultResources from "../assets/Default Resources.json";

function Resources(props) {
    console.log(props.data.data[props.selected]);

    try {
        const returnVal = props.data.data[props.selected].map((item, index) =>
            <li key={index}><a href="#" onClick={() => window.electron.openLink(item.link)}>{item.name}</a> - {item.description} <button onClick={() => { props.deleteResource(item.name) }} className="delete-resource">X</button></li>
        )
        return (
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

    function deleteResource(dlName) {
        const newld = localData;
        const filteredContent = newld.data[localData.selected]
            .filter((e) => {
                return dlName != e.name;
            })
        newld.data[localData.selected] = filteredContent;
        setLocalData(newld);
        triggerRefresh(!refresh);
    }

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
                    <label htmlFor="resource-category-input">Select resources: </label>
                    <select value={localData.selected} onChange={(e) => { setLocalData({ ...localData, selected: e.target.value }) }} name="resource-category-input" id="resource-category-input" >
                        {options}
                    </select>
                    <Resources selected={localData.selected} data={localData} deleteResource={deleteResource} />
                </div>
            </>
        )
    }
    catch (error) {
        console.log(error);
    }

}