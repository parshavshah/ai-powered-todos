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
        let result = 0;

        if (id) {
            result = await Todo.destroy({
                where: {
                    id
                }
            })
        }

        if (result === 0) {
            return {
                success: false,
                message: 'Todo not found'
            };
        }

        return {
            success: true,
            message: `Todo deleted successfully`,
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