const { todo: todoService } = require('../services/todoService')

async function listTodos(req, res) {
    const result = await todoService.listTodos()
    res.json(result);
}

async function createTodo(req, res) {
    const { title, description } = req.body;
    const result = await todoService.createTodo({ title, description })
    res.json(result);
}

async function deleteTodo(req, res) {
    const { id } = req.params;
    const result =await todoService.deleteTodo({ id })
    res.json(result);
}


module.exports = {
    listTodos,
    createTodo,
    deleteTodo
}