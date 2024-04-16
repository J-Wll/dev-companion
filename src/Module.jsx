import "./css/Module.css"

import NoteContent from "./module-contents/NoteContent";
import TodoContent from "./module-contents/TodoContent";
import TimerContent from "./module-contents/TimerContent";
import KanbanContent from "./module-contents/KanbanContent";

import { useRef, useEffect, useState } from "react";
import Draggable from 'react-draggable';

// TODO: Optimise resize observers (Only one)

export default function Module(props) {
    // console.log(props);

    const moduleRef = useRef();
    const [refresh, triggerRefresh] = useState(false);

    const myObserver = new ResizeObserver(() => {
        props.setData(props.counter, { sizeX: moduleRef.current.style.width, sizeY: moduleRef.current.style.height }, "size")
    })

    // Triggers after the first render when the ref is defined
    useEffect(() => {
        if (moduleRef.current) {
            console.log(moduleRef.current.style.height, moduleRef.current.style.width);
            myObserver.observe(moduleRef.current);
        }


    }, [])

    let component, title;
    let defaultSize = ["400px", "450px"]
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
            defaultSize = ["325px", "275px"];
            break;
        case "Kanban":
            component = <KanbanContent {...componentProps} />;
            title = "Kanban Board";
            defaultSize = ["650px", "500px"];
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
        props.setData(props.counter, { x: draggableProps.x, y: draggableProps.y }, "pos")
        props.topZIndex();
        triggerRefresh(!refresh);
    }

    function handleStart() {
        props.setData(props.counter, 1000, "zIndex")
        triggerRefresh(!refresh);
    }

    const defaultPos = props.dataFromGlobal.pos ? props.dataFromGlobal.pos : { x: 10, y: 10 }
    console.log(props.dataFromGlobal.size ? [props.dataFromGlobal.size.sizeX, props.dataFromGlobal.size.sizeY] : defaultSize)
    let [sizeX, sizeY] = props.dataFromGlobal.size ? [props.dataFromGlobal.size.sizeX, props.dataFromGlobal.size.sizeY] : defaultSize;
    let zIndexVal = props.dataFromGlobal.zIndex ? props.dataFromGlobal.zIndex : 1;
    console.log(component, title);



    let hide;
    let resizeVal = "both";
    let char = "-";
    let pointerVal = "all";
    console.log(props.dataFromGlobal.minimised || undefined);
    if (props.dataFromGlobal.minimised || undefined) {
        hide = {
            display: "none", zIndex: "-1"
        };
        resizeVal = "none";
        pointerVal = "none";
        char = "◻";
    };


    return (
        <Draggable handle=".module-title" defaultPosition={defaultPos} onStop={handleStop} onStart={handleStart}>
            <div ref={moduleRef} className={`module ${props.purpose.toLowerCase()}-module`} style={{ height: sizeY, width: sizeX, zIndex: zIndexVal, resize: resizeVal, pointerEvents: pointerVal }} >
                <div className="menu-bar" style={{ pointerEvents: "all" }}>
                    <p className="module-title">{title}</p>
                    <div className="module-bar-buttons">
                        <button onClick={() => { props.setData(props.counter, !props.dataFromGlobal.minimised, "minimised"); triggerRefresh(!refresh) }} className="close-module">{char}</button>
                        <button onClick={() => props.deleteModule(props.counter)} className="close-module">X</button>
                    </div>
                </div>
                <div className="module-body" style={hide} >
                    {component}
                </div>
            </div>
        </Draggable>
    )
}