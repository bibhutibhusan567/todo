import React, { useState, useEffect } from 'react';
import './App.css';
import TodoTasks from './TodoTasks.js';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'

function Todolist(props) {
    const [taskArray, setTaskArray] = useState([]);
    const [newTask, setNewTask] = useState('');

    const getData = (event) => {
        setNewTask(event.target.value);
    }
    const addTask = () => {
        //send data to backend
        fetch('https://bibhuti-todo-backend.herokuapp.com/todo', {
            method: 'POST',
            body: JSON.stringify({ task: newTask }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((r) => r.json())
            .then((resp) => {
                console.log("Got data from POST backend", resp);
                taskArray.push(resp);
                setTaskArray([...taskArray]);
                setNewTask("");
            });
    };
    const editHandler = (editedTask, idx) => {
        const idToEdit = taskArray[idx]._id;
        fetch(`https://bibhuti-todo-backend.herokuapp.com/todo/${idToEdit}`, {
            method: "PUT",
            body: JSON.stringify({ task: editedTask }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        }).then((r) => r.json())
            .then((resp) => {
                console.log("Got successfull response from PUT", resp);
                taskArray[idx] = resp;
                setTaskArray([...taskArray]);
            });

    }
    const deleteHandler = (idx) => {
        const idToDelete = taskArray[idx]._id;
        fetch(`https://bibhuti-todo-backend.herokuapp.com/todo/${idToDelete}`, {
            method: "DELETE",
            credentials: 'include'
        }).then((r) => {
            console.log('got successsfull DELETE');
            taskArray.splice(idx, 1);
            setTaskArray([...taskArray]);
        });

    };
    useEffect(() => {
        fetch('https://bibhuti-todo-backend.herokuapp.com/todo', { credentials: 'include' })
            .then((r) => r.json())
            .then((arr) => {
                console.log(arr);
                const sortedArr = arr.sort((a, b) => {
                    const aDateNumeric = new Date(a.creationTime).valueOf();
                    const bDateNumeric = new Date(b.creationTime).valueOf();

                    return aDateNumeric - bDateNumeric;
                });
                // sorts in ascending order of id - timestamp
                // const taskArr = sortedArr.map((item) => item.task); // gets the task for each item to create a strig array
                setTaskArray(sortedArr); // sets the array of { id, task }
            });
    }, []);
    return (
        <div className="App">
            <div id="header">Todo App</div>
            <div className="userplace">
                Welcome: {props.userName}
                <Button variant="danger" onClick={props.logoutHandler} style={{ marginLeft: "20px" }}>Log Out</Button>
            </div>
            <br />
            <br />
            <Table className="table" striped bordered hover variant="dark" >
                <thead>
                    <tr style={{ justifyContent: "center" }}>
                        <td>
                            <input type="text" onChange={getData} value={newTask} placeholder="new task" />
                        </td>
                        <td colSpan="2">
                            <Button
                                onClick={addTask}
                                disabled={(newTask.trim().length === 0) ? true : false}
                            >Add Task</Button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {taskArray.map((todoTask, idx) => (
                        (
                            <tr key={idx} style={{ justifyContent: "center" }}>
                                <TodoTasks
                                    idx={idx}
                                    editHandler={editHandler}
                                    deleteHandler={deleteHandler}
                                    task={todoTask}
                                />
                            </tr>
                        )
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Todolist;