const express = require('express');
const eventRoutes = require('./routes/events');
const {errorHandler} = require("./utils/helper");
const app = express();

app.use(express.json());
app.use(errorHandler);

app.use('/api/events', eventRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});