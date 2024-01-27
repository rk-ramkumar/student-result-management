const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
const bcrypt = require('bcrypt');
require('dotenv').config()

// Dummy data for testing
const initialStats = [
  { title: 'Total Students', value: '500' },
  { title: 'Exams Conducted', value: '20' },
  { title: 'Average Score', value: '85%' }
];

const initialRecentActivity = [
  'User John Doe conducted an exam on Biology - 01/25/2024',
  'User Jane Smith viewed student results - 01/24/2024'
  // Add more dummy recent activities as needed
];

const app = express();
const PORT =  process.env.PORT || 4000;;
const uri = process.env.DATABASE_URL;
app.use(cors())

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

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [optionSchema],
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],  
});


const Stat = mongoose.model('Stat', new mongoose.Schema({
    title: String,
    value: String
}));

const RecentActivity = mongoose.model('RecentActivity', new mongoose.Schema({
    activity: String
}));
  
const Exam = mongoose.model('Exam', examSchema);

const ExamResult = mongoose.model('ExamResult', new mongoose.Schema({
    studentName: String,
    score: Number,
    grade: String,
    exam: String,
    subject: String,
}));


const User = mongoose.model('User', userSchema);

// Endpoint to get statistics
app.get('/stats', async (req, res) => {
    try {
        await mongoose.connect(uri, clientOptions)
    
        const stats = await Stat.find();
        res.json(stats);  
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('Internal Server Error');
    }
});
  
// Endpoint to get recent activity
app.get('/recent-activity', async (req, res) => {
   
});


// Endpoint to fetch the example exam
app.get('/exams/example-exam', async (req, res) => {
    try {
      await mongoose.connect(uri, clientOptions)

      const exampleExam = await Exam.findOne({ title: 'Example Exam' });
  
      if (!exampleExam) {
        return res.status(404).json({ error: 'Example exam not found.' });
      }
  
      res.status(200).json(exampleExam);
    } catch (error) {
      console.error('Error fetching example exam:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Endpoint to conduct an exam
app.post('/conduct-exam', async (req, res) => {
  try {
      const { studentName, exam, subject, answers } = req.body;

      await mongoose.connect(uri, clientOptions);

      // Validate if required parameters are present in the request body
      if (!studentName || !exam || !subject || !answers || !Array.isArray(answers) || answers.length === 0) {
          return res.status(400).json({ error: 'Invalid exam details in the request.' });
      }

      // Calculate score and grade based on your criteria
      const score = calculateScore(answers);
      const grade = calculateGrade(score);

      // Create a new ExamResult document
      const examResult = new ExamResult({
          studentName,
          score,
          grade,
          exam,
          subject,
      });

      // Save the exam result to the database
      await examResult.save();

      res.status(200).json({ message: 'Exam submitted successfully.', score, grade });
  } catch (error) {
      console.error('Error conducting exam:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateScore(answers) {

  return answers.reduce((total, answer) => total + answer, 0);
}

function calculateGrade(score) {
  if (score >= 90) {
      return 'A';
  } else if (score >= 80) {
      return 'B';
  } else if (score >= 70) {
      return 'C';
  } else {
      return 'F';
  }
}

  
// Endpoint to get exam results

app.get('/results', async (req, res) => {
    try {
        const { studentName, exam, subject } = req.query;
        
        await mongoose.connect(uri, clientOptions);
        
        const query = {
            studentName: studentName,
            exam: exam,
            
        };

        const results = await ExamResult.find(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching exam results:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await mongoose.disconnect();
    }
});


// Registration Route
app.post('/register', async (req, res) => {
    try {
        await mongoose.connect(uri, clientOptions)

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
    try {
        await mongoose.connect(uri, clientOptions)

        const { username, password } = req.body;
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
