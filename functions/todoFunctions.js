module.exports.todoFunctions = [
    {
        name: 'createTodo',
        description: 'Create a new todo item',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'The title of the todo item'
                },
                description: {
                    type: 'string',
                    description: 'Optional description of the todo item'
                }
            },
            required: ['title']
        }
    },
    {
        name: 'deleteTodo',
        description: 'Delete a todo item by ID or title. Provide either id or title parameter.',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'The ID of the todo item to delete'
                },
                title: {
                    type: 'string',
                    description: 'The title or partial title of the todo item to delete'
                }
            }
        }
    },
    {
        name: 'listTodos',
        description: 'List all todo items',
        parameters: {
            type: 'object',
            properties: {}
        }
    }
];