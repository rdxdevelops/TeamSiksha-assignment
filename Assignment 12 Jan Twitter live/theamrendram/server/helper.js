const fs = require("fs");
const path = require("path");

function fetchData() {
  const filePath = path.join(__dirname, "data.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  fetchData,
};
