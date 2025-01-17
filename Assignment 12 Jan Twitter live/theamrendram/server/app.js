const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());


// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

app.use("/", routes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 