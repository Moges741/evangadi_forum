const express = require('express');
const app = express();
const port = 5173;

// middleware to read JSON body
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Group 2!');
});

// register route
app.post('/api/users/register', (req, res) => {
    res.send('User registered successfully');
});

// GET route for testing register endpoint in browser
app.get('/api/users/register', (req, res) => {
    res.send('Register endpoint is working!');
});

// login route
app.post('/api/users/login', (req, res) => {
    res.send('User login is working');
});

// check user route
app.get('/api/users/check', (req, res) => {
    res.send('User check is working');
});

app.listen(port, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});
