const fs = require('fs').promises;
const path = require('path');

async function readData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        throw new Error('Failed to read data');
    }
}

async function writeData(data) {
    try {
        await fs.writeFile(
            path.join(__dirname, 'data.json'),
            JSON.stringify(data, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Error writing data:', error);
        throw new Error('Failed to write data');
    }
}

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
};

module.exports = {readData, writeData, errorHandler}