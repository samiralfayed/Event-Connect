const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/eventConnect') // Removed deprecated options
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define the Event schema and model
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

// Routes
// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Create a new event
app.post('/api/events', async (req, res) => {
    const { title, description, date, time, location, organizer } = req.body;

    // Validate request body
    if (!title || !description || !date || !time || !location || !organizer) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newEvent = new Event({ title, description, date, time, location, organizer });
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Serve frontend
app.use(express.static('public'));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
