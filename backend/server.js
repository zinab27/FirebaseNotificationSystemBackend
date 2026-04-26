const express = require("express"); // Express framework for server
const cors = require("cors"); // CORS middleware to allow cross-origin requests
const admin = require("firebase-admin"); // Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
});

const app = express();

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://notification-5ac8e.web.app",
  );
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.options("*", cors()); // Handle preflight requests

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

module.exports = app;
