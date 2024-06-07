const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let passwords = [];

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/save-password', (req, res) => {
    const { username, password, URL } = req.body;

    if (username && password && URL) {
        passwords.push({ username, password, URL });
        res.status(200).send('Password saved successfully');
    } else {
        res.status(400).send('Username, password, and URL are required');
    }
});

app.post('/delete-password', (req, res) => {
    const { index } = req.body;

    if (index !== undefined && index >= 0 && index < passwords.length) {
        passwords.splice(index, 1);
        res.status(200).send('Password deleted successfully');
    } else {
        res.status(400).send('Invalid index');
    }
});

app.get('/get-passwords', (req, res) => {
    res.json(passwords);
});

app.post('/get-password', (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < passwords.length) {
        res.json(passwords[index]);
    } else {
        res.status(400).json({ error: 'Invalid index' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
