import { useState } from 'react'
import './css/TodoContent.css'

export default function TodoContent() {
    const [todoList, setTodoList] = useState([]);

    function addTodo() {
        setTodoList((prev) => [...prev, { key: self.crypto.randomUUID(), data: "" }]);
    }

    function updateTodoText(newVal, key) {
        console.log(newVal);
        console.log(key);
        setTodoList((prev) => prev.map((todo) => todo.key === key ? { ...todo, data: newVal } : todo));
        console.log(todoList);
    }

    function getTodos() {
        return (todoList.map((todo) => <TodoItem key={todo.key} counter={todo.key} text={todo.data} updateTodoText={updateTodoText} />))
    }

    return (
        <section className="todo-content">
            <button onClick={addTodo}>Add To-do Item</button>
            {getTodos()}
        </section>
    )
}

function TodoItem(props) {

    return (
        <div className="todo-item">
            <input type="text" placeholder="What would you like to do?" value={props.text} onChange={(e) => props.updateTodoText(e.target.value, props.counter)} />
        </div>
    )
}