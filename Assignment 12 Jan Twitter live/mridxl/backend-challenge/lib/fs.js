import fs from 'fs';

export const readData = (filePath) => {
	console.log('Reading data from file:', filePath);
	try {
		const rawData = fs.readFileSync(filePath);
		return JSON.parse(rawData);
	} catch (error) {
		console.error('Error reading data file:', error);
		return [];
	}
};

export const writeData = (filePath, data) => {
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error('Error writing to data file:', error);
	}
};
