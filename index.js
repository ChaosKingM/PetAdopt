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

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const app = express();
const PORT = process.env.PORT || 3000;


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PetAdopt API Documentation',
            version: '1.0.0',
            description: 'API for the storage and reading of adoption center database',
        }, 
        servers: [
            {
                url: `http://localhost:${PORT}`,
            }
        ]
    },
    apis: ['./index.js', './src/routes/*.js'], 
};

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hey, You are in my backend!!!");
});





const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/petAdopt/Api-Doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));






app.use("/api/user", userRoutes);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - System
 *     summary: Welcoming
 *     responses:
 *       200:
 *         description: A simple welcome message
 */
app.use("/api/pets", petRoutes);

app.use("/api/swipe", swipeRoutes);

app.listen(PORT, () => {
    console.log(`Port connection running in: http://localhost:${PORT}`)
});