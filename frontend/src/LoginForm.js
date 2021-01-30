import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function LoginForm(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (<>
        <div className="logo">TODO APP</div>
        <Card bg='secondary'
            style={{
                justifyContent: "space-evenly",
                marginLeft: '30%',
                marginTop: '10px',
                width: '40%',
                height: '250px'
            }}>
            <input
                id="userName"
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
            />
            <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            {props.error ? (<div className="error">{props.error}</div>) : null}
            <div >
                <Button style={{ marginLeft: "32%" }} onClick={() => props.loginHandler(userName, password)}>Login</Button>
                <Button style={{ marginLeft: "5%" }} onClick={() => props.signupHandler(userName, password)}>Signup</Button>
            </div>
        </Card>
    </>
    );
}

export default LoginForm;