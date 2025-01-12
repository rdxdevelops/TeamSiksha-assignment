import express from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import eventRoutes from "./routes/event.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
