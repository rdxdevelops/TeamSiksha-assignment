import express from 'express';
import path from 'path';
import { readData, writeData } from './lib/fs.js';

const app = express();
app.use(express.json());

// Path to data.json file
const dataFilePath = path.join(import.meta.dirname, 'data', 'data.json');

app.get('/', (req, res) => {
	res.send(
		'Welcome to the Events API: submission for the Team shiksha backend challenge by mridxl'
	);
});

// Get Event by Slug
app.get('/events/:slug', (req, res) => {
	const data = readData(dataFilePath); // Read data from file
	const event = data.find((e) => e.slug === req.params.slug && !e.isDeleted);
	if (event) {
		res.status(200).json(event);
	} else {
		res.status(404).json({ error: 'Event not found' });
	}
});

// Search by Title or Description
app.get('/events/search', (req, res) => {
	const query = req.query.q?.toLowerCase() || '';
	const data = readData(dataFilePath);
	const results = data.filter(
		(event) =>
			!event.isDeleted &&
			(event.title.toLowerCase().includes(query) ||
				event.description.toLowerCase().includes(query))
	);
	res.status(200).json(results);
});

// Soft Delete Event
app.delete('/events/:slug', (req, res) => {
	const data = readData(dataFilePath);
	const event = data.find((e) => e.slug === req.params.slug);
	if (event) {
		event.isDeleted = true;
		writeData(dataFilePath, data);
		res.status(200).json({ message: 'Event soft-deleted successfully' });
	} else {
		res.status(404).json({ error: 'Event not found' });
	}
});

// Update Description
app.put('/events/:slug/description', (req, res) => {
	const { description } = req.body;
	if (!description) {
		return res.status(400).json({ error: 'Description is required' });
	}

	const data = readData(dataFilePath);
	const event = data.find((e) => e.slug === req.params.slug && !e.isDeleted);
	if (event) {
		event.description = description;
		writeData(dataFilePath, data);
		res.status(200).json({ message: 'Description updated successfully' });
	} else {
		res.status(404).json({ error: 'Event not found' });
	}
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
