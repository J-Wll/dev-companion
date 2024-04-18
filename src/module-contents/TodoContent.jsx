import { useState, useEffect } from 'react'
import '../css/css-module-content/TodoContent.css'
import { ContentEditableDiv } from "../small-components/ContentEditableDiv";

// TODO: Should probably convert todoList to an object mapped into an array at render. Because there are so many Maps going on here

export default function TodoContent(props) {
    const [todoList, setTodoList] = useState(props.dataFromGlobal);

    // Set initial state to an array to prevent errors
    if (todoList === undefined) {
        setTodoList([]);
        // Add an item by default
        addTodo(null, []);
    }

    useEffect(() => {
        // Updating data in the global state when state changes
        if (todoList) {
            props.setData(props.counter, todoList)
        }
    }, [todoList])

    function addTodo(e, targetArray = todoList) {
        // Arguments are used to avoid an issue with out of sync state when trying to add an item by default
        setTodoList((prev) => [...targetArray, { key: self.crypto.randomUUID(), order: targetArray.length, checked: false, data: "" }]);
    }

    function deleteTodo(iKey) {
        const deletedTodo = todoList.filter((todo) => todo.key !== iKey);
        // Assigns the new index order to each entry after deletion
        setTodoList(deletedTodo.map((todo, index) => { return { ...todo, order: index } }));
    }

    function updateTodoText(newVal, iKey) {
        setTodoList((prev) => prev.map((todo) => todo.key === iKey ? { ...todo, data: newVal } : todo));
    }

    function checkTodo(iKey, currentVal) {
        setTodoList((prev) => prev.map((todo) => todo.key === iKey ? { ...todo, checked: !currentVal } : todo));
    }

    function changeTodoOrder(event, direction, target, currentOrder) {
        if (todoList.length < 2) {
            return;
        }

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

        // If it's more than 1 difference in either direction
        const shiftBottom = moveTo > currentOrder + 1;
        const shiftTop = moveTo < currentOrder - 1;
        let changedOrder;
        if (shiftBottom || shiftTop) {
            console.log("-----Shift key-----");
            changedOrder = todoList.map((todo) => {
                if (todo.key === target) {
                    return { ...todo, order: moveTo };
                }
                // Increases/Decreases the order of those in between current order and the top/bottom
                if (todo.key != target) {
                    if (shiftTop) {
                        if (todo.order < currentOrder) {
                            return { ...todo, order: todo.order + 1 };
                        }
                    } else {
                        if (todo.order > currentOrder) {
                            return { ...todo, order: todo.order - 1 };
                        }
                    }
                }
                return todo;
            })
        }
        else {
            changedOrder = todoList.map((todo) => {
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
        }


        // Sorts the todolist by the new orders
        setTodoList(changedOrder.sort((a, b) => a.order - b.order));
        console.log(todoList);
    }

    function getTodos() {
        // Prevents an error from trying to map todolist when it is still undefined
        if (todoList) {
            return (todoList.map((todo) => <TodoItem key={todo.key} counter={todo.key} text={todo.data} order={todo.order} checked={todo.checked} checkTodo={checkTodo} updateTodoText={updateTodoText} changeTodoOrder={changeTodoOrder} deleteTodo={deleteTodo} />))
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
    const strikeThrough = props.checked ? { textDecoration: "line-through" } : undefined
    return (
        <div className="todo-item">
            <input type="checkbox" checked={props.checked} onChange={() => props.checkTodo(props.counter, props.checked)} />
            <div className="reorder-buttons">
                <button onClick={(e) => props.changeTodoOrder(e, "u", props.counter, props.order)}>^</button>
                <button onClick={(e) => props.changeTodoOrder(e, "d", props.counter, props.order)}>⌄</button>
            </div>
            <ContentEditableDiv type="text" class="todo-item-text" Placeholder="What would you like to do?" style={strikeThrough} value={props.text} onChange={(newVal) => props.updateTodoText(newVal, props.counter)} />
            <button className="delete-todo" onClick={() => props.deleteTodo(props.counter)}>X</button>
        </div>
    )
}