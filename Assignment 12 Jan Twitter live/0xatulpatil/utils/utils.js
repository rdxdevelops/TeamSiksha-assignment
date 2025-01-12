function searchForText(text, data) {
	return data.filter(
		(obj) =>
			typeof obj.title === "string" &&
			obj.title.toLowerCase().includes(text.toLowerCase())
	);
}

module.exports = searchForText;
