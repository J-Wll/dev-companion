// React Quill https://www.npmjs.com/package/react-quill

import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "../css/noteContent.css"
import "../css/QuillSnow.css"


export default function NoteContent(props) {
    // const [localData, setLocalData] = useState(props.globalModuleData.current[props.counter].data);
    const [localData, setLocalData] = useState(props.dataFromGlobal);

    // const noteContent = data;
    // const setNoteContent = (arg) => data = arg;
    // const [noteContent, setNoteContent] = useState("");
    // () => props.setData(props.setData)

    console.log(props);
    // console.log(props.globalModuleData.current[props.counter].data);


    // useEffect(() => { props.setData(props.counter, localData) }, [localData])
    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])


    function handleChange(val) {
        console.log(val)
        setLocalData(() => val);
        // props.setData(props.counter, val)
    }
    return (
        <ReactQuill value={localData} onChange={handleChange} theme="snow" />
        // <textarea value={localData} onChange={e=>setLocalData(e.target.value)}/>
    )
}