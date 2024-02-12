import { useState } from 'react'
import './css/TodoContent.css'

export default function TodoContent() {
    const [todoList, setTodoList] = useState([]);
    return (
        <section className="todo-content">
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
            <TodoItem text="Do this" />
        </section>
    )
}

function TodoItem(props) {
    return (
        <div className="todo-item">
            <p>{props.text}</p>
        </div>
    )
}