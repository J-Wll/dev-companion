// React Quill https://www.npmjs.com/package/react-quill

import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "../css/css-module-content/noteContent.css"
import "../css/css-module-content/QuillSnow.css"


function getTemplate() {
    const dateTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    // Basic borton model
    // TODO: Option to change between borton/boud/maybe custom template
    // TODO: Save a default preset/choice in config.json
    return `<p>${dateTime}</p><p><br></p><p><strong><u>What</u></strong></p><p>What happened?</p><p><br></p><p><br></p><p><strong><u>So what</u></strong></p><p>What does it mean?</p><p><br></p><p><br></p><p><strong><u>Now what</u></strong></p><p>What will you do now?<br></p><p><br></p>`
};

export default function NoteContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    console.log(props);

    if (props.reflective && !localData) {
        setLocalData(() => getTemplate());
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    function handleChange(val) {
        console.log(val)
        setLocalData(() => val);
    }

    return (
        <ReactQuill value={localData} onChange={handleChange} theme="snow" />
        // <textarea value={localData} onChange={e=>setLocalData(e.target.value)}/>
    )
}