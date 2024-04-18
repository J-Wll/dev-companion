import { useState, useEffect, useRef } from "react";

import "../css/css-module-content/ResourcesContent.css"
import defaultResources from "../assets/Default Resources.json";

import { ContentEditableDiv } from "../small-components/ContentEditableDiv";

function Resources(props) {
    console.log(props.data.data[props.selected]);

    try {
        const returnVal = props.data.data[props.selected].map((item, index) =>
            <li key={index}><a href="#" onClick={() => window.electron.openLink(item.link)}>{item.name}</a> - {item.description} <button onClick={() => { props.deleteResource(item.name) }} className="delete-resource">X</button></li>
        )
        return (
            <ul>
                {returnVal}
            </ul>
        )
    }
    catch (error) {
        console.log(error);
    }
}


function ResourceInput(props) {
    const [nameInp, setNameInp] = useState("");
    const [linkInp, setLinkInp] = useState("");
    const [descriptionInp, setDescriptionInp] = useState("");

    function addData() {
        let newld = props.localData;
        if (props.inpType === "item") {
            newld.data[props.localData.selected].push({ name: nameInp, link: linkInp, description: descriptionInp });
        }
        else if (props.inpType === "category") {
            newld.data[nameInp] = [];
            newld.selected = nameInp;
        }
        props.setLocalData(newld);
        props.triggerRefresh();
    }

    let extraFields = <></>;
    if (props.inpType === "item") {
        extraFields =
            <>
                <ContentEditableDiv class="resource-field-inp" Placeholder="Full link" value={linkInp} onChange={(v) => setLinkInp(v)} />
                <ContentEditableDiv class="resource-field-inp" Placeholder="Description" value={descriptionInp} onChange={(v) => setDescriptionInp(v)} />
            </>
    }
    return (
        <>
            <ContentEditableDiv class="resource-field-inp" Placeholder="Name" value={nameInp} onChange={(v) => setNameInp(v)} />
            {extraFields}

            <div>
                <button onClick={addData}>Add</button>
                <button onClick={() => props.toggleCategory(false)}>Close</button>
            </div>
        </>
    )
}

export default function ResourcesContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [options, setOptions] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [categoryInputOn, setCategoryInputOn] = useState(false);
    const [itemInputOn, setItemInputOn] = useState(false);

    function triggerRefresh() {
        setRefresh(!refresh);
        loadOptions();
    }

    function deleteResource(dlName) {
        const newld = localData;
        const filteredContent = newld.data[localData.selected]
            .filter((e) => {
                return dlName != e.name;
            })
        newld.data[localData.selected] = filteredContent;
        setLocalData(newld);
        triggerRefresh();
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    if (!localData || !localData.data) {
        let newLocalData = {};
        newLocalData.data = JSON.parse(JSON.stringify(defaultResources));
        newLocalData.selected = "General";

        console.log(newLocalData);
        setLocalData(() => newLocalData);
    }

    function loadOptions() {
        setOptions(Object.keys(localData.data).map((option, index) => {
            let selected;
            if (option === localData.selected) {
                selected = "selected"
            }
            return <option selected={selected} key={index} value={option}>{option}</option>
        }))
    }

    useEffect(() => {
        loadOptions();
    }, [])

    // console.log(props.counter, localData, defaultResources);

    let inputSection = <></>
    if (categoryInputOn) {
        inputSection = <ResourceInput toggleCategory={setCategoryInputOn} inpType="category" localData={localData} setLocalData={setLocalData} triggerRefresh={triggerRefresh} refresh={refresh} />
    }
    else if (itemInputOn) {
        inputSection = <ResourceInput toggleCategory={setItemInputOn} inpType="item" localData={localData} setLocalData={setLocalData} triggerRefresh={triggerRefresh} />
    }

    try {
        return (
            <>
                <div>
                    <label htmlFor="resource-category-input">Select resources: </label>
                    <select value={localData.selected} onChange={(e) => { setLocalData({ ...localData, selected: e.target.value }) }} name="resource-category-input" id="resource-category-input" >
                        {options}
                    </select>
                    <button onClick={() => { setCategoryInputOn(!categoryInputOn); setItemInputOn(false) }}>Add category</button>
                    <button onClick={() => { setItemInputOn(!itemInputOn); setCategoryInputOn(false) }}>Add item</button>
                    {inputSection}
                    <Resources selected={localData.selected} data={localData} deleteResource={deleteResource} />
                </div>
            </>
        )
    }
    catch (error) {
        console.log(error);
    }

}