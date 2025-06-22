const todoService = require('../services/todoService')

function listTodos(req, res) {
    res.json(todoService.listTodos());
}

function createTodo(req, res) {
    const { title, description } = req.body;
    res.json(todoService.createTodo({ title, description }));
}

function deleteTodo(req, res) {
    const { id } = req.params;
    res.json(todoService.deleteTodo({ id }));
}


module.exports = {
    listTodos,
    createTodo,
    deleteTodo
}