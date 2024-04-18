// React Quill https://www.npmjs.com/package/react-quill

import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "../css/css-module-content/noteContent.css"
import "../css/css-module-content/QuillSnow.css"


function getTemplate(tName) {
    const dateTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    // Basic borton model
    // TODO: Option to change between borton/boud/maybe custom template
    // TODO: Save a default preset/choice in config.json
    let returnContent = "";
    switch (tName) {
        case "Borton":
            returnContent = "<p><br></p><p><strong><u>What</u></strong></p><p>What happened?</p><p><br></p><p><br></p><p><strong><u>So what</u></strong></p><p>What does it mean?</p><p><br></p><p><br></p><p><strong><u>Now what</u></strong></p><p>What will you do now?<br></p><p><br></p><p><br></p>"
            break;
        case "Boud":
            returnContent = "<p><br></p><p><strong><u>Return to the experience</u></strong></p><p>What happened and how did you react?</p><p><br></p><p><br></p><p><strong><u>Attend to feelings</u></strong></p><p>Set aside negative emotions and enhance positive ones</p><p><br></p><p><br></p><p><strong><u>Re-evaluating the experience</u></strong></p><p>Follow these steps:</p><ol><li>Association: Use new ideas and feelings from the experience and reflection to form associations with pre-existing knowledge.</li><li>Integration: Integrate these associations into a new whole by determining relationships and drawing conclusions.</li><li>Validation: Assess the validity of the integrations by examining them against existing knowledge and resolving contradictions.</li><li>Appropriation: Internalise and make your integrations your own.</li></ol><p><br></p><p><br></p>"
            break;
        case "Gibbs":
            returnContent = "<p><strong><u>Describe</u></strong></p><p>Describe the experience.</p><p><br></p><p><br></p><p><strong><u>Feelings</u></strong></p><p>What are your feelings about the experience?</p><p><br></p><p><br></p><p><strong><u>Evaluation</u></strong></p><p>Evaluate the good and the bad of the experience.</p><p><br></p><p><br></p><p><strong><u>Analysis</u></strong></p><p>Analyse to make sense of the experience.</p><p><br></p><p><br></p><p><strong><u>Conclusion</u></strong></p><p>What did you learn and what could have been done differently?</p><p><br></p><p><br></p><p><strong><u>Action plan</u></strong></p><p>How will you deal with similar situations in the future?</p><p><br></p><p><br></p>"
            break;
        // Default and ERA
        default:
            returnContent = "<p><br></p><p><strong><u>Experience</u></strong></p><p>What happened?</p><p><br></p><p><br></p><p><strong><u>Reflection</u></strong></p><p>What did you feel? Could you have acted in a different way?</p><p><br></p><p><br></p><p><strong><u>Action</u></strong></p><p>What will you do the next time a similar experience happens?</p><p><br></p><p><br></p>"
            break;
    }
    return `<p>${dateTime}</p>${returnContent}`
};

export default function NoteContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);

    let templateSelect = <></>

    if (typeof localData != "string") {
        setLocalData("");
    }

    if (props.reflective) {
        if (!localData) {
            setLocalData(() => getTemplate("ERA"));
        }
        templateSelect =
            <div className="reflective-template-div">
                <button onClick={() => setLocalData(() => getTemplate("Borton"))}>Borton</button>
                <button onClick={() => setLocalData(() => getTemplate("Boud"))}>Boud</button>
                <button onClick={() => setLocalData(() => getTemplate("Gibbs"))}>Gibbs</button>
                <button onClick={() => setLocalData(() => getTemplate("ERA"))}>ERA</button>
            </div>
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    function handleChange(val) {
        setLocalData(() => val);
    }

    return (
        <>
            {templateSelect}
            <ReactQuill value={localData} onChange={handleChange} theme="snow" modules={{ clipboard: { matchVisual: false } }} />
        </>
    )
}