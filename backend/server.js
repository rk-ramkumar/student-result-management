const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config()

const app = express();
const PORT =  process.env.PORT || 4000;;
const uri = process.env.DATABASE_URL;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already exists.');
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).send('Registration successful.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Login Route
app.post('/login', async (req, res) => {
    console.log(res)
    try {
        const { username, password } = req.body;
        console.log(username)
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password.');
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password.');
        }

        // Authentication successful
        res.status(200).send('Login successful.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
