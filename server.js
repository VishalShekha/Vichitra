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

app.get('/get-passwords', (req, res) => {
    res.json(passwords);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});