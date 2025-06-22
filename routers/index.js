const express = require("express");
const router = express.Router();

const todoAgent = require('../agents/todoAgent');
const todoController = require('../controllers/todoController');

// agent routers
router.post('/smart-agent', todoAgent.manageTodos);

// todo apis
router.get('/api/todos', todoController.listTodos);
router.post('/api/todos', todoController.createTodo);
router.delete('/api/todos/:id', todoController.deleteTodo);

module.exports = router;