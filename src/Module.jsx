import './css/Module.css'
import NoteContent from "./noteContent";
import TodoContent from "./TodoContent";

export default function Module(props) {
    // console.log(props);

    let component, title;
    const componentProps = { data: props.data, setData: props.setData, counter: props.counter, dataFromGlobal: props.dataFromGlobal }
    switch (props.purpose) {
        case "Notes":
            component = <NoteContent {...componentProps} />;
            title = "Notes";
            break;
        case "Todo":
            component = <TodoContent {...componentProps} />;
            title = "To-do List";
            break;
        default:
            component = <></>;
            title = props.purpose;
            break;
    }

    console.log(component, title);
    return (
        <div className={`module ${props.purpose}-module`}>
            <div className="menu-bar">
                <p className="module-title">{title}</p>
                <button onClick={() => props.deleteModule(props.counter)} className="close-module">X</button>
            </div>
            <div className="module-body">
                {component}
            </div>
        </div>
    )
}