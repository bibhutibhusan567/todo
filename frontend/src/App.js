import React, { useState, useEffect } from 'react';
import './App.css';
import Todolist from './Todolist.js';
import LoginForm from './LoginForm.js';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState();
  const [userName, setUserName] = useState(undefined);

  useEffect(() => {
    getUserName();
  }, []);
  const getUserName = () => {
    return fetch('https://bibhuti-todo-backend.herokuapp.com/userinfo', { credentials: 'include' })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          setLoggedIn(false);
          setUserName(undefined);
          return { success: false };
        }
      }).then((r) => {
        if (r.success !== false) {
          setLoggedIn(true);
          setUserName(r.userName);
          setError();
        }
      });
  }
  const signupHandler = (userName, password) => {
    loginOrSignup('https://bibhuti-todo-backend.herokuapp.com/signup', userName, password);
  }
  const loginHandler = (userName, password) => {
    loginOrSignup('https://bibhuti-todo-backend.herokuapp.com/login', userName, password);
  }
  const logoutHandler = () => {
    return fetch('https://bibhuti-todo-backend.herokuapp.com/logout', { credentials: 'include' })
      .then((r) => {
        console.log(r);
        if (r.ok) {
          console.log("logout successfull");
          setLoggedIn(false);
          setUserName(undefined);
        }
      })
  };
  const loginOrSignup = (url, userName, password) => {
    if (userName.trim().length === 0 || password.trim().length === 0) {
      setError(`Please fill the required fields`);
    } else {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({ userName, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then((res) => {
          if (res.ok) {
            return { success: true };
          } else {
            return res.json();
          }
        })
        .then((res) => {
          if (res.success === true) {
            return getUserName();
          }
          else {
            setError(res.error);
          }
        });
    }
  }

  return (
    (loggedIn) ? (
      <Todolist userName={userName} logoutHandler={logoutHandler} />
    ) : (
        <LoginForm
          loginHandler={loginHandler}
          signupHandler={signupHandler}
          error={error}
        />)
  );
}

export default App;
