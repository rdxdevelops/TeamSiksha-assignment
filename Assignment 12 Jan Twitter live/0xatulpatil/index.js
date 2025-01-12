const express = require("express");
const app = express();
const db = require("./data.json");
const PORT = 3000;
const searchForText = require("./utils/utils");

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Welcome to Team Shiksha");
});

// Get by slugId
app.get("/slug/:slugid", (req, res) => {
	let slugId = req.params.slugid;
	const item = db.find((item) => item.slug === slugId);

	if (item) {
		res.send(item);
	} else {
		res.status(404).send({ message: "Slug not found" });
	}
});

// Update slug description
app.post("/slug/:slugid", (req, res) => {
	const slugId = req.params.slugid;
	const description = req.body.description;

	const itemIndex = db.findIndex((item) => item.slug === slugId);

	if (itemIndex === -1) {
		return res.status(404).send({ message: "Slug not found" });
	}
	db[itemIndex].description = description;
	res.status(200).send(req.body);
});

// Soft delete a post by slugId
app.delete("/slug/:slugid", (req, res) => {
	const slugId = req.params.slugid;

	const itemIndex = db.findIndex((item) => item.slug === slugId);
	if (itemIndex === -1) {
		return res.status(404).send({ message: "Slug not found" });
	}

	db.splice(itemIndex, 1);
	res.status(200).send();
});

// Search through slugs
app.post("/search", (req, res) => {
	const titleToSearch = req.body.title;
	const result = searchForText(titleToSearch, db);
	res.status(200).send(result);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
