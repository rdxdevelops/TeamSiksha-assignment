import app from "./app";
import AppController from "./controllers/appController";

const PORT = 3000;
app.get('/api/:slug', AppController.RetrieveEvents);
app.get('/api/search', AppController.SearchEvents);
app.put('/api/:slug/description', AppController.UpdateEventDescription);
app.delete('/api/:slug/delete', AppController.SoftDeleteEvent);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});