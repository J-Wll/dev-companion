import "./Sidebar.css"


export default function Sidebar() {
    return (
        // these buttons could check how many in row, if already 3 create new row, else add to existing row

        <div className="Sidebar">
            <button>Close Sidebar</button>
            <button>Add Notes</button>
            <button>Add Kanban</button>
        </div>
    )
}