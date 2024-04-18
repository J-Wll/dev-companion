import "./css/Module.css"

import NoteContent from "./module-contents/NoteContent";
import TodoContent from "./module-contents/TodoContent";
import TimerContent from "./module-contents/TimerContent";
import KanbanContent from "./module-contents/KanbanContent";
import ResourcesContent from "./module-contents/ResourcesContent";

import { useRef, useEffect, useState } from "react";
import Draggable from 'react-draggable';

// TODO: Optimise resize observers (Only one)

export default function Module(props) {
    // console.log(props);

    const moduleRef = useRef();
    const [refresh, triggerRefresh] = useState(false);

    const myObserver = new ResizeObserver(() => {
        if (moduleRef.current != undefined) {
            props.setData(props.counter, { sizeX: moduleRef.current.style.width, sizeY: moduleRef.current.style.height }, "size")
        }
    })

    // Triggers after the first render when the ref is defined
    useEffect(() => {
        if (moduleRef.current) {
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
            component = <TimerContent {...componentProps} />;
            title = "Timer";
            defaultSize = ["325px", "275px"];
            break;
        case "Kanban":
            component = <KanbanContent {...componentProps} />;
            title = "Kanban Board";
            defaultSize = ["650px", "500px"];
            break;
        case "Resources":
            component = <ResourcesContent {...componentProps} />;
            title = "Resources";
            defaultSize = ["500px", "280px"];
            break;
        default:
            component = <></>;
            title = props.purpose;
            break;
    }

    function saveFile() {
        const dateTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(props.dataFromGlobal.data)]);
        a.href = URL.createObjectURL(file);
        a.download = `${props.purpose}-${dateTime}-${props.counter}.json`;
        a.click();
    }

    function loadFile() {
        let a = document.createElement('input');
        a.type = 'file';
        a.onchange = _ => {
            const reader = new FileReader();
            let file = Array.from(a.files)[0];
            reader.onload = (e) => {
                let data = "";
                try {
                    data = JSON.parse(e.target.result);
                    console.log('Loaded data:', data);
                    props.setData(props.counter, data);
                    props.topZIndex();
                    triggerRefresh(!refresh);
                } catch (error) {
                    alert(error);
                }
            };
            reader.readAsText(file);
        }
        a.click();

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
    // console.log(props.dataFromGlobal.size ? [props.dataFromGlobal.size.sizeX, props.dataFromGlobal.size.sizeY] : defaultSize)
    let [sizeX, sizeY] = props.dataFromGlobal.size ? [props.dataFromGlobal.size.sizeX, props.dataFromGlobal.size.sizeY] : defaultSize;
    let zIndexVal = props.dataFromGlobal.zIndex ? props.dataFromGlobal.zIndex : 1;
    // console.log(component, title);



    let hide;
    let resizeVal = "both";
    let char = "-";
    let pointerVal = "all";
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
                        <button onClick={saveFile} className="menu-bar-button big-menu-bar-button">Save</button>
                        <button onClick={loadFile} className="menu-bar-button big-menu-bar-button">Load</button>
                        <button onClick={() => { props.setData(props.counter, !props.dataFromGlobal.minimised, "minimised"); triggerRefresh(!refresh) }} className="menu-bar-button">{char}</button>
                        <button onClick={() => props.deleteModule(props.counter)} className="menu-bar-button">X</button>
                    </div>
                </div>
                <div className="module-body" style={hide} >
                    {component}
                </div>
            </div>
        </Draggable>
    )
}