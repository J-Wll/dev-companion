import { useState, useEffect } from 'react'
import './css/TodoContent.css'

export default function TodoContent(props) {
    const [todoList, setTodoList] = useState(props.dataFromGlobal);

    // Set initial state to an array
    if (todoList === undefined) {
        setTodoList([]);
    }

    useEffect(() => {
        if (todoList) {
            props.setData(props.counter, todoList)
        }
    }, [todoList])

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
        // Prevents an error from trying to map todolist when it is still undefined
        if (todoList) {
            return (todoList.map((todo) => <TodoItem key={todo.key} counter={todo.key} text={todo.data} updateTodoText={updateTodoText} />))
        }
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