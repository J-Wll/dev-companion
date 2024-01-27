// React Quill https://www.npmjs.com/package/react-quill

import { useState } from "react";
import ReactQuill from "react-quill";
import "./css/noteContent.css"
import "./css/QuillSnow.css"


export default function NoteContent() {
    const [noteContent, setNoteContent] = useState("");
    return (
        <ReactQuill value={noteContent} onChange={setNoteContent} theme="snow"/>
    )
}