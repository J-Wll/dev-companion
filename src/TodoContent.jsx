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
        setTodoList((prev) => [...prev, { order: todoList.length, key: self.crypto.randomUUID(), data: "" }]);
        console.log(todoList);
    }

    function deleteTodo(iKey) {
        const deletedTodo = todoList.filter((todo) => todo.key !== iKey);
        // Assigns the new index order to each entry after deletion
        setTodoList(deletedTodo.map((todo, index) => { return { ...todo, order: index } }));
    }

    function updateTodoText(newVal, iKey) {
        setTodoList((prev) => prev.map((todo) => todo.key === iKey ? { ...todo, data: newVal } : todo));
    }

    function changeTodoOrder(event, direction, target, currentOrder) {
        if (todoList.length < 2) {
            return;
        }
        console.log(event, direction)
        let moveTo;
        if (direction === "u") {
            moveTo = event.shiftKey ? 0 : currentOrder - 1;
        }
        else {
            moveTo = event.shiftKey ? todoList.length : currentOrder + 1;
        }
        // If it is negative become 0
        moveTo = moveTo < 0 ? 0 : moveTo;
        // If it's bigger than the array + 1 (0 index) become the length of the array -1
        moveTo = moveTo > todoList.length - 1 ? todoList.length - 1 : moveTo;
        // If it has not changed then return before doing anything else
        if (moveTo === currentOrder) {
            return;
        }
        console.log(todoList);
        console.log(moveTo);

        // TODO: handle shift click differently
        const changedOrder = todoList.map((todo) => {
            // If it's the target set to moveTo
            if (todo.key === target) {
                return { ...todo, order: moveTo };
            }
            // If it's the item occupying the postion, set it to the initial order (So they swap)
            if (todo.order === moveTo) {
                return { ...todo, order: currentOrder };
            }
            return todo;
        })

        // Sorts the todolist by the new orders
        setTodoList(changedOrder.sort((a, b) => a.order - b.order));
        console.log(todoList);


        // const updatedOrder = todoList.map()
        // const sortedTodos = [...updatedOrder].sort();

    }

    function getTodos() {
        // Prevents an error from trying to map todolist when it is still undefined
        console.log(todoList);
        if (todoList) {
            return (todoList.map((todo) => <TodoItem key={todo.key} counter={todo.key} text={todo.data} order={todo.order} updateTodoText={updateTodoText} changeTodoOrder={changeTodoOrder} deleteTodo={deleteTodo} />))
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
            <div className="reorder-buttons">
                <button onClick={(e) => props.changeTodoOrder(e, "u", props.counter, props.order)}>^</button>
                <button onClick={(e) => props.changeTodoOrder(e, "d", props.counter, props.order)}>⌄</button>
            </div>
            <input type="text" placeholder="What would you like to do?" value={props.text} onChange={(e) => props.updateTodoText(e.target.value, props.counter)} />
            <button className="delete-todo" onClick={() => props.deleteTodo(props.counter)}>X</button>
        </div>
    )
}