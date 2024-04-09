import "./css/Module.css"

import NoteContent from "./module-contents/NoteContent";
import TodoContent from "./module-contents/TodoContent";
import TimerContent from "./module-contents/TimerContent";

import Draggable from 'react-draggable';

export default function Module(props) {
    // console.log(props);

    let component, title;
    const componentProps = { data: props.data, setData: props.setData, counter: props.counter, dataFromGlobal: props.dataFromGlobal.data }
    // TODO: every possible purpose, make sure each one has the break
    switch (props.purpose) {
        case "Notes":
            component = <NoteContent {...componentProps} />;
            title = "Notes";
            break;
        case "Reflective":
            component = <NoteContent {...componentProps} reflective={true} />;
            title = "Reflective Journal";
            break;
        case "Todo":
            component = <TodoContent {...componentProps} />;
            title = "To-do List";
            break;
        case "Timer":
            console.log("IIIIIIIIIIIIIIIII")
            component = <TimerContent {...componentProps} />;
            title = "Timer";
            break;
        default:
            component = <></>;
            title = props.purpose;
            break;
    }

    // on stop assign the update global data ref for this module, that will be used as the default position if it is loaded again
    // similar mechanism for size
    // misallignment problem is probably due to using cursor position, which can grab any point along the bar
    function handleStop(mouseEvent, draggableProps) {
        props.setData(props.counter, { x: draggableProps.x, y: draggableProps.y }, true)
    }

    const defaultPos = props.dataFromGlobal.layout ? props.dataFromGlobal.layout : { x: 10, y: 10 }
    console.log(component, title);



    return (
        <Draggable handle=".menu-bar" defaultPosition={defaultPos} onStop={handleStop}>
            <div className={`module ${props.purpose.toLowerCase()}-module`} style={{ height: "200px", width: "200px" }}>
                <div className="menu-bar">
                    <p className="module-title">{title}</p>
                    <button onClick={() => props.deleteModule(props.counter)} className="close-module">X</button>
                </div>
                <div className="module-body">
                    {component}
                </div>
            </div>
        </Draggable>
    )
}