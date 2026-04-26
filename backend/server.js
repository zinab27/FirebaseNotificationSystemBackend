const express = require("express"); // Express framework for server
const cors = require("cors"); // CORS middleware to allow cross-origin requests
const admin = require("firebase-admin"); // Firebase Admin SDK

const serviceAccount = require("./serviceAccountKey.json"); // Load service account key for Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Initialize with service account
});

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Subscribe endpoint
app.post("/subscribe", async (req, res) => {
  const { token, topic } = req.body;
  try {
    const response = await admin.messaging().subscribeToTopic(token, topic);
    console.log("Subscribe response:", response);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unsubscribe endpoint
app.post("/unsubscribe", async (req, res) => {
  const { token, topic } = req.body;
  try {
    const response = await admin.messaging().unsubscribeFromTopic(token, topic);
    console.log("Unsubscribe response:", response);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000")); // Start the server on port 3000
