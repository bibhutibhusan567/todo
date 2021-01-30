import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';

export default function TodoTask(props) {
    const [editMode, setEditMode] = useState(false);
    const [editTask, setEditTask] = useState(props.task.task);

    const getEditedTask = (event) => {
        setEditTask(event.target.value);
    }
    const saveEditedTask = () => {
        props.editHandler(editTask, props.idx);
        setEditMode(false);
    }
    return (
        <>
            {editMode ? (
                <>
                    <td style={{ width: "80%" }}><input type="text" onChange={getEditedTask} placeholder="Edit Task" value={editTask} /></td>
                    <td colSpan="2"><Button style={{ marginBottom: "10px" }} variant="success" onClick={saveEditedTask} disabled={editTask.length === 0 ? true : false}>Save Task</Button></td>
                </>
            ) : (
                    <>
                        <td style={{ width: "80%", overflow: "hidden" }}>{props.task.task}</td>
                        <td><Button style={{ marginBottom: "10px" }} onClick={() => setEditMode(true)}>Edit</Button></td>
                        <td><Button variant="danger" onClick={() => props.deleteHandler(props.idx)}>Delete</Button></td>
                    </>
                )}
        </>
    );
}