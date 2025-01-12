const express = require('express');
const {readData, errorHandler, writeData} = require("../utils/helper");
const router = express.Router();

router.get('/get/:slug', async (req, res, next) => {
    try {
        const events = await readData();
        const event = events.find(e => e.slug === req.params.slug && !e.deleted);

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        res.json({
            status: 'success',
            data: event
        });
    } catch (error) {
        next(error);
    }
});

// Search events by title or description
router.get('/search', async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const events = await readData();
        const searchResults = events.filter(event => {
            if (event.deleted) return false;

            const searchTerm = query.toLowerCase();
            return (
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm)
            );
        });

        res.json({
            status: 'success',
            data: searchResults
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/:slug', async (req, res, next) => {
    try {
        const events = await readData();
        const eventIndex = events.findIndex(e => e.slug === req.params.slug);

        if (eventIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        events[eventIndex] = {
            ...events[eventIndex],
            deleted: true,
            deletedAt: new Date().toISOString()
        };

        await writeData(events);

        res.json({
            status: 'success',
            message: 'Event soft deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/update/:slug/description', async (req, res, next) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                status: 'error',
                message: 'Description is required'
            });
        }

        const events = await readData();
        const eventIndex = events.findIndex(e => e.slug === req.params.slug && !e.deleted);

        if (eventIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        events[eventIndex] = {
            ...events[eventIndex],
            description,
            updatedAt: new Date().toISOString()
        };

        await writeData(events);

        res.json({
            status: 'success',
            data: events[eventIndex]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;