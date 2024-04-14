import Draggable from 'react-draggable';

import "../css/css-module-content/kanbanContent.css"

export default function KanbanContent() {
    return (
        <>
            <div className='kanban-column'>

            </div>
            <div className='kanban-column'>

            </div>
            <div className='kanban-column'>

            </div>
            <Draggable bounds={"parent"} axis={"both"} grid={[200, 1]}>
                <span className='kanban-item'>
                    <button>-</button>
                    <textarea defaultValue={"akofpadsjfio[sdjf[oisdjf[oijsdf]]]"}></textarea>

                </span>
            </Draggable>
        </>
    )
}