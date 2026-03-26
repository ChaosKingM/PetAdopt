require('dotenv').config();
// Fix: Node.js SRV DNS resolver fails on some Windows setups — force Google DNS
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Tools
const express = require('express');
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();