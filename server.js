const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, etc.)

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/haru', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema for the data
const dataSchema = new mongoose.Schema({
    text: String
});

// Create a model for the data
const Data = mongoose.model('Data', dataSchema, 'dataset'); // Collection name is 'dataset'

// Route to get random data
app.get('/data/random', async (req, res) => {
    try {
        const count = await Data.countDocuments();
        const random = Math.floor(Math.random() * count);
        const data = await Data.findOne().skip(random);
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
