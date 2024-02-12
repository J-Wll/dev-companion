import './css/Module.css'
import NoteContent from "./noteContent";

export default function Module(props) {
    // console.log(props);

    function componentContent(purpose) {
        const componentProps = { data: props.data, setData: props.setData, counter: props.counter, globalModuleData: props.globalModuleData }
        switch (purpose) {
            case "Notes":
                return <NoteContent {...componentProps} />
            case "Todo":
                // return <NoteContent {...componentProps} />
                break;
            default:
                break;
        }
        // if (purpose === "Notes") {
        //     // return <NoteContent data={props.data} setData={props.setData} counter={props.counter} globalModuleData = {props.globalModuleData} />
        // }
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