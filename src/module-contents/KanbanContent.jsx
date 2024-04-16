// TODO: Use DND-KIT with draggable and droppable for a better implementation https://dndkit.com

import { useState, useEffect } from "react";
import Draggable from 'react-draggable';

import "../css/css-module-content/kanbanContent.css"

function KanbanColumn(props) {
    return (
        <div className='kanban-column'>
            <div className="kanban-header">
                <span className="kanban-column-name" contentEditable="true">{props.name}</span>
                <div>
                    <button>+</button>
                    <button>x</button>
                </div>
            </div>

        </div>
    )
}

function KanbanItem(props) {

    return (
        <Draggable bounds={"parent"} axis={"both"} grid={[200, 5]} defaultPosition={{ x: 0, y: 40 }}>
            {/* Uses placeholder styling in KanbanContent.css */}
            <span className='kanban-item' contentEditable="true" Placeholder="Task">
                {props.text}
            </span>
        </Draggable>
    )
}

export default function KanbanContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    return (
        <>
            <KanbanColumn name="do" />
            <KanbanColumn name="doing" />
            <KanbanColumn name="done" />
            <button className="add-kanban-column-button">+</button>

            <KanbanItem text="Do this" />

        </>
    )
}