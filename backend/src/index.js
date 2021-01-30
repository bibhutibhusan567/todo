const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');

const session_secret = "newton";

const app = express();
app.use(express.json());//add body key to req
app.set('trust proxy', 1);//trust first proxy
app.use(cors({
  credentials: true,
  origin: "https://bibhuti-todo.herokuapp.com"
}));
app.use(session(
  {
    secret: session_secret,
    cookie: { maxAge: 1 * 60 * 60 * 1000, sameSite: 'none', secure: true }
  }
));//add special property called session to req


//db connection
const db = mongoose.createConnection('mongodb+srv://bibhuti:Bibhuti@123@todo.5rfof.mongodb.net/todoApp?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true });
//Schemas
const userSchema = new mongoose.Schema({
  userName: String,
  password: String
});

const todoSchema = new mongoose.Schema({
  task: String,
  done: Boolean,
  creationTime: Date,
  userId: mongoose.Schema.Types.ObjectId
});
//models
const todoModel = db.model("todo", todoSchema);
const userModel = db.model("user", userSchema);

const isNullOrUndefined = (val) => val === null || val === undefined;
const SALT = 5;
//backend Api
app.post('/signup', async (req, res) => {
  const { userName, password } = req.body;
  const exisistingUser = await userModel.findOne({ userName });
  if (isNullOrUndefined(exisistingUser)) {
    const hashedPassword = bcrypt.hashSync(password, SALT);
    const newUser = new userModel({
      userName,
      password: hashedPassword
    });
    await newUser.save();
    req.session.userId = newUser._id;

    res.status(201).send({ success: `Signup successfull.` });
  }
  else {
    res.status(400).send({ error: `Username ${userName} already exist. Please choose different username` });
  }
});

app.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  const exisistingUser = await userModel.findOne({ userName });
  if (isNullOrUndefined(exisistingUser)) {
    res.status(401).send({ error: `Username/password is incorrect.` });
  }
  else {
    const hashedPassword = exisistingUser.password;
    if (bcrypt.compareSync(password, hashedPassword)) {
      req.session.userId = exisistingUser._id;
      res.status(200).send({ success: `Login successfull.` });
    } else {
      res.status(401).send({ error: `Username/password is incorrect.` });
    }
  }
});
//authentication middleware
const AuthMiddleware = async (req, res, next) => {

  if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId)) {
    res.status(401).send({ error: `Not logged in` });
  }
  else {
    next();
  }
}//add user key to req

app.get('/todo', AuthMiddleware, async (req, res) => {
  const userId = req.session.userId;
  const allTodos = await todoModel.find({ userId });
  res.send(allTodos);
});

app.post('/todo', AuthMiddleware, async (req, res) => {
  const todo = req.body;
  todo.creationTime = new Date();
  todo.done = false;
  todo.userId = req.session.userId;
  const newTodo = new todoModel(todo);
  await newTodo.save();
  res.status(201).send(newTodo);
});

app.put('/todo/:todoId', AuthMiddleware, async (req, res) => {
  const { task } = req.body;
  const todoId = req.params.todoId;

  try {
    const todo = await todoModel.findOne({ _id: todoId, userId: req.session.userId });
    if (isNullOrUndefined(todo)) {
      res.sendStatus(404);
    } else {
      todo.task = task;
      await todo.save();
      res.send(todo);
    }
  } catch (e) {
    res.send(404);
  }
});

app.delete('/todo/:todoId', AuthMiddleware, async (req, res) => {
  const todoId = req.params.todoId;
  try {
    await todoModel.deleteOne({ _id: todoId, userId: req.session.userId });
    res.sendStatus(200);
  } catch (e) {
    res.send(404);
  }
});
app.get('/logout', (req, res) => {
  if (!isNullOrUndefined(req.session)) {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(200);
  }
});
app.get('/userinfo', AuthMiddleware, async (req, res) => {
  const user = await userModel.findById(req.session.userId);
  res.send({ userName: user.userName });
});
app.get('/', (req, res) => {
  res.send('server Works');
});

app.listen(process.env.PORT, () => console.log("db is connected on port 9090....."));
