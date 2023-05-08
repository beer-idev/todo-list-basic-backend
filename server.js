const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 4000;

const todosFilePath = path.join(__dirname, "todos.json");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

const router = express.Router();

router.get("/items", (req, res) => {
  const todos = JSON.parse(fs.readFileSync(todosFilePath));

  const response = todos.items.sort((a, b) => {
    const itemA = a.item.toLowerCase();
    const itemB = b.item.toLowerCase();
    if (itemA < itemB) {
      return -1;
    } else if (itemA > itemB) {
      return 1;
    } else {
      return 0;
    }
  });

  res.status(200).json({
    status: 200,
    massage: response,
  });
});

router.post("/add-items", (req, res) => {
  const todos = JSON.parse(fs.readFileSync(todosFilePath));
  const newTodo = req.body;
  //   console.log(newTodo);
  newTodo.id = Date.now();
  todos.items.push(newTodo);
  fs.writeFileSync(todosFilePath, JSON.stringify(todos));
  res.status(200).json({
    status: 200,
    massage: "Create Successfully",
  });
});

router.post("/update-items/:id", (req, res) => {
  const todos = JSON.parse(fs.readFileSync(todosFilePath));
  const updatedTodo = req.body;
  const todoIndex = todos.items.findIndex(
    (todo) => todo.id === Number(req.params.id)
  );
  if (todoIndex !== -1) {
    todos.items[todoIndex] = updatedTodo;
    fs.writeFileSync(todosFilePath, JSON.stringify(todos));
    res.status(200).json({
      status: 200,
      massage: "Update Successfully",
      data: todos,
    });
  } else {
    res.status(404).json({
      status: 404,
      massage: "Update Failed",
    });
  }
});

router.post("/del-items/:id", (req, res) => {
  const todos = JSON.parse(fs.readFileSync(todosFilePath));
  const todoIndex = todos.items.findIndex(
    (todo) => todo.id === Number(req.params.id)
  );
  if (todoIndex !== -1) {
    todos.items.splice(todoIndex, 1);
    fs.writeFileSync(todosFilePath, JSON.stringify(todos));
    res.status(200).json({
      status: 200,
      massage: "Delete Successfully",
    });
  } else {
    res.status(404).json({
      status: 404,
      massage: "Delete Failed",
    });
  }
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
