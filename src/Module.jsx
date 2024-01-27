import './css/Module.css'
import NoteContent from "./noteContent";

export default function Module(props) {
    // console.log(props);

    function componentContent(purpose) {
        // probably check purpose in a dict, one side component names and one components, each component in its own file 
        if (purpose === "Notes") {
            return <NoteContent data={props.data} setData={props.setData} counter={props.counter} />
        }
    }

    return (
        <div className={`module ${props.purpose}-module`}>
            <div className="menu-bar">
                <p className="module-title">{props.purpose}</p>
                <button onClick={() => props.deleteModule(props.counter)} className="close-module">X</button>
            </div>
            <div className="module-body">
                {componentContent(props.purpose)}
            </div>
        </div>
    )
}