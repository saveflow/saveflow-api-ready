const express = require('express');
const bodyParser = require('body-parser');
const downloadHandler = require('./api/download-video'); // Import route handler

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// API route
app.post('/api/download-video', downloadHandler);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('SaveFlow API is running ✅');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
