import { useState, useEffect } from "react";
import Draggable from 'react-draggable';

import "../css/css-module-content/kanbanContent.css"

function KanbanColumn(props) {
    return (
        <div className='kanban-column'>
            <div className="kanban-header">
                {props.name}
                <div>
                    <button>+</button>
                    <button>edit</button>
                    <button>x</button>
                </div>
            </div>

        </div>
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

            <button>+</button>

            <Draggable bounds={"parent"} axis={"both"} grid={[200, 1]}>
                <span className='kanban-item'>
                    <button>-</button>
                    <textarea defaultValue={"akofpadsjfio[sdjf[oisdjf[oijsdf]]]"}></textarea>

                </span>
            </Draggable>
        </>
    )
}