const express = require('express');
const fs = require('node:fs').promises;
const path = require('node:path');
const app = express();
const port = 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let events = [];

async function loadEvents() {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        events = JSON.parse(data);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Get event by slug
app.get('/api/events/:slug', (req, res) => {
    const event = events.find(e => e.slug === req.params.slug && !e.deleted);
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Search events
app.get('/api/events', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.json(events.filter(e => !e.deleted));
    }

    const filtered = events.filter(e => 
        !e.deleted && (
            e.title.toLowerCase().includes(query.toLowerCase()) ||
            e.description.toLowerCase().includes(query.toLowerCase())
        )
    );
    res.json(filtered);
});

// Soft delete event
app.delete('/api/events/:slug', (req, res) => {
    const index = events.findIndex(e => e.slug === req.params.slug);
    if (index !== -1) {
        events[index] = { ...events[index], deleted: true };
        res.json({ message: 'Event deleted successfully' });
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Update description
app.patch('/api/events/:slug', (req, res) => {
    const { description } = req.body;
    const event = events.find(e => e.slug === req.params.slug && !e.deleted);
    if (event && description) {
        event.description = description;
        res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found or invalid request' });
    }
});

loadEvents().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
