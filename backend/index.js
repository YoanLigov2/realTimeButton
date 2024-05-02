// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1791864",
  key: "fe962295d397897d3376",
  secret: "66ca332a4f7ca12f2726",
  cluster: "eu",
  useTLS: true
});

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://ligovyoan:Zu4TVf5p4cqheAHu@cluster0.ewemmko.mongodb.net/react-app?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for button state
const buttonStateSchema = new mongoose.Schema({
  isOn: Boolean,
}, {collection: "buttonStates"});
const ButtonState = mongoose.model('buttonState', buttonStateSchema);

// API routes
app.use(express.json());
app.use(cors());

// Get button state
app.get('/api/buttonState', async (req, res) => {
  try {
    const buttonState = await ButtonState.findOne();
    res.json(buttonState);
  } catch (error) {
    console.error('Error fetching button state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update button state
app.post('/api/buttonState', async (req, res) => {
  try {
    await ButtonState.updateOne({}, { isOn: req.body.isOn });
    pusher.trigger("my-channel", "my-event", {
      state: req.body.isOn
    });
    res.json({ message: 'Button state updated successfully' });
  } catch (error) {
    console.error('Error updating button state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});