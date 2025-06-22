const OpenAI = require('openai');
const { todo } = require('../services/todoService')
const { todoFunctions } = require('../functions/todoFunctions')

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

module.exports.manageTodos = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Call OpenAI with function calling
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that manages todo items. Use the provided functions to create, delete, or list todos based on user requests.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            functions: todoFunctions,
            function_call: 'auto'
        });

        const responseMessage = response.choices[0].message;

        // Check if a function was called
        if (responseMessage.function_call) {
            const functionName = responseMessage.function_call.name;
            const functionArgs = JSON.parse(responseMessage.function_call.arguments);

            // Execute the appropriate function
            const result = await todo[functionName](functionArgs);

            // Generate a natural language response
            const followUpResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. Provide a natural, friendly response based on the function result.'
                    },
                    {
                        role: 'user',
                        content: message
                    },
                    {
                        role: 'assistant',
                        content: null,
                        function_call: responseMessage.function_call
                    },
                    {
                        role: 'function',
                        name: functionName,
                        content: JSON.stringify(result)
                    }
                ]
            });

            return res.json({
                message: followUpResponse.choices[0].message.content,
                functionCalled: functionName,
                result: result
            });
        } else {
            // No function was called, return the AI's response
            return res.json({
                message: responseMessage.content,
                functionCalled: null,
                result: null
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}