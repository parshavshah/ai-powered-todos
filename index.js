const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const indexRouter = require('./routers/index')

app.use("/", indexRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`AI Todo Server running on port ${PORT}`);
    console.log(`Main endpoint: POST /api/todo`);
    console.log(`Health check: GET /health`);
});

module.exports = app;