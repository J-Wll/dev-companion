// TODO: Use DND-KIT with draggable and droppable for a better implementation https://dndkit.com
// TODO: Tidy this up and add some comments

import { useState, useEffect } from "react";
import Draggable from 'react-draggable';

import "../css/css-module-content/kanbanContent.css"
import { ContentEditableDiv } from "../small-components/ContentEditableDiv";

function KanbanColumn(props) {

    function deleteColumn() {
        props.setLocalData((prev) => { return { items: prev.items, columns: prev.columns.filter((column) => column.key !== props.id) } })
    }

    function updateColumn(prop, val) {
        props.setLocalData((prev) => { return { items: prev.items, columns: prev.columns.map((column) => column.key === props.id ? { ...column, [prop]: val } : column) } })
    }

    function addItem() {
        const itemKey = self.crypto.randomUUID();
        console.log(props.position * 200);

        let lowestItem = 0;
        props.localData.items.filter((item) => item.location.x === props.position * 200).forEach(item => {
            if (item.location.y > lowestItem) {
                lowestItem = item.location.y;
            }
        });
        const spawnY = lowestItem > 0 ? lowestItem + 60 : 40;

        props.setLocalData(
            { ...props.localData, items: [...props.localData.items, { key: itemKey, text: "", location: { x: props.position * 200, y: spawnY } }] }
        )
    }

    return (
        <div className='kanban-column'>
            <div className="kanban-header">
                <ContentEditableDiv class='kanban-column-name' onChange={(textChange) => updateColumn("text", textChange)} Placeholder="Name" value={props.text} />
                <div>
                    <button onClick={addItem}>+</button>
                    <button onClick={deleteColumn}>x</button>
                </div>
            </div>

        </div>
    )
}

function KanbanItem(props) {
    function updateItem(prop, val) {
        props.setLocalData((prev) => { return { columns: prev.columns, items: prev.items.map((item) => item.key === props.id ? { ...item, [prop]: val } : item) } })
    }
    function deleteItem() {
        props.setLocalData((prev) => { return { columns: prev.columns, items: prev.items.filter((item) => item.key !== props.id) } })
    }

    function handleStop(mouseEvent, draggableProps) {
        // props.setLocalData((prev) => { return { columns: prev.columns, items: prev.items.map((item) => item.key === props.id ? { ...item, location: { x: draggableProps.x, y: draggableProps.y } } : item) } })
        updateItem("location", { x: draggableProps.x, y: draggableProps.y })
    }


    return (
        <Draggable bounds={"parent"} axis={"both"} grid={[200, 5]} defaultPosition={props.location} onStop={handleStop}>
            {/* Uses placeholder styling in KanbanContent.css */}
            <div className="draggable-wrapper">
                <ContentEditableDiv class='kanban-item' onChange={(textChange) => updateItem("text", textChange)} Placeholder="Task" value={props.text} />
                <button onClick={deleteItem} className="delete-kanban-item">x</button>
            </div>
        </Draggable>
    )
}

export default function KanbanContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [refresh, triggerRefresh] = useState(false);

    useEffect(() => {
        if (!localData || !localData.columns) {
            setLocalData({ columns: [{ key: "default-do", text: "Do" }, { key: "default-doing", text: "Doing" }, { key: "default-done", text: "Done" }], items: [{ key: "default-item", text: "Do this", location: { x: 0, y: 40 } }] })
        }
        triggerRefresh(!refresh);
    }, [])

    console.log(localData)

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    function createColumn() {
        const columnKey = self.crypto.randomUUID();
        setLocalData((prev) => { return { items: prev.items, columns: [...prev.columns, { key: columnKey, text: "" }] } })
    }

    function getColumns() {
        try {
            return localData.columns.map((column, index) =>
                <KanbanColumn key={column.key} id={column.key} text={column.text} position={index} localData={localData} setLocalData={setLocalData} />)
        } catch (error) {
            return <></>
        }
    };

    function getItems() {
        try {
            return localData.items.map((item) =>
                <KanbanItem key={item.key} id={item.key} text={item.text} location={item.location} localData={localData} setLocalData={setLocalData} />)
        } catch (error) {
            return <></>
        }
    };

    return (
        <>
            {getColumns()}
            {getItems()}
            <button className="add-kanban-column-button" onClick={createColumn}>+</button>
        </>
    )
}