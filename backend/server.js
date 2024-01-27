const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/rm');

const resultSchema = new mongoose.Schema({
    studentName: String,
    subject: String,
    marks: Number
});

const Result = mongoose.model('Result', resultSchema);

app.get('/results', async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Implement other CRUD operations as needed

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
