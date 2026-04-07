require('dotenv').config();
// Fix: Node.js SRV DNS resolver fails on some Windows setups — force Google DNS
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Tools
const express = require('express');

// Imports
const cors = require('cors');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/users');
const petRoutes = require('./src/routes/pets');
const swipeRoutes = require('./src/routes/swipes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hey, You are in my backend!!!");
});

app.use("/api/user", userRoutes);

app.use("/api/pets", petRoutes);

app.use("/api/swipe", swipeRoutes);

app.listen(PORT, () => {
    console.log(`Port connection running in: http://localhost:${PORT}`)
});