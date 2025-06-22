
const uuidv4 = require('uuid').v4;

// In-memory todo storage (use database in production)
let todos = [];

// Todo management functions
const todoFunctions = {
    createTodo: ({ title, description = '' }) => {
        const newTodo = {
            id: uuidv4(),
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.push(newTodo);
        return {
            success: true,
            message: `Todo "${title}" created successfully`,
            todo: newTodo
        };
    },

    deleteTodo: ({ id, title }) => {
        let todoIndex = -1;

        if (id) {
            todoIndex = todos.findIndex(todo => todo.id === id);
        } else if (title) {
            todoIndex = todos.findIndex(todo =>
                todo.title.toLowerCase().includes(title.toLowerCase())
            );
        }

        if (todoIndex === -1) {
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

    listTodos: () => {
        return {
            success: true,
            message: `Found ${todos.length} todos`,
            todos: todos
        };
    }
};

module.exports = { todo: todoFunctions };