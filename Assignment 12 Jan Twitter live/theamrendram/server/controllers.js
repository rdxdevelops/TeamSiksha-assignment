const { fetchData } = require("./helper");
const path = require("path");
const fs = require("fs");
const getDataBySlug = (req, res) => {
  const data = fetchData();
  const slug = req.params.slug;

  const event = data.find((event) => event.slug === slug);
  if (!event || event.deleted) {
    return res.status(404).send("Event not found");
  }
  res.status(200).json(event);
};

const updateDataBySlug = (req, res) => {
  const data = fetchData();
  const slug = req.params.slug;
  const { description } = req.body;

  const event = data.find((event) => event.slug === slug);
  if (!event || event.deleted) {
    return res.status(404).send("Event not found");
  }

  event.description = description;

  const filePath = path.join(__dirname, "data.json");
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).send("Event updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const deleteDataBySlug = (req, res) => {
  const slug = req.params.slug;

  const data = fetchData();
  const event = data.find((event) => event.slug === slug);
  if (!event) {
    return res.status(404).send("Event not found");
  }

  event.deleted = true;

  const filePath = path.join(__dirname, "data.json");
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).send("Event deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const searchData = (req, res) => {
  console.log(req.query.q);
  const data = fetchData();
  const query = req.query.q;
  console.log("q", query);
  const filteredDta = data.filter(
    (event) =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json(filteredDta);
};

module.exports = {
  getDataBySlug,
  updateDataBySlug,
  deleteDataBySlug,
  searchData,
};
