
const { Todo } = require('../models');


// Todo management functions
const todoFunctions = {
    createTodo: async ({ title, }) => {
        const newTodo = {
            title
        };
        await Todo.create(newTodo);
        return {
            success: true,
            message: `Todo "${title}" created successfully`,
            todo: newTodo
        };
    },

    deleteTodo: async ({ id }) => {
        let result = -1;

        if (id) {
            result = await Todo.destroy({
                where: {
                    id
                }
            })
            console.log({ result })
        }

        if (result === -1) {
            return {
                success: false,
                message: 'Todo not found'
            };
        }

        const deletedTodo = todos.splice(todoIndex, 1)[0];
        return {
            success: true,
            message: `Todo "${deletedTodo.title}" deleted successfully`,
            deletedTodo
        };
    },

    listTodos: async () => {

        const todos = await Todo.findAll();
        return {
            success: true,
            message: `Found ${todos.length} todos`,
            todos: todos
        };
    }
};

module.exports = { todo: todoFunctions };