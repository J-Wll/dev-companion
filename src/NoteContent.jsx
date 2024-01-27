// React Quill https://www.npmjs.com/package/react-quill

import { useState } from "react";
import ReactQuill from "react-quill";
import "./css/noteContent.css"
import "./css/QuillSnow.css"


export default function NoteContent(props) {
    // const noteContent = data;
    // const setNoteContent = (arg) => data = arg;
    // const [noteContent, setNoteContent] = useState("");
    console.log(props);
    // () => props.setData(props.setData)
    function handleChange(val){
        console.log(val)
        props.setData(props.counter, val)
    }
    return (
        <ReactQuill value={props.data} onChange={handleChange} theme="snow"/>
    )
}