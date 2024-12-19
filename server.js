// npm install express mongodb
// start : node server.js

// Import necessary modules
const express = require("express");
const { MongoClient } = require("mongodb"); // Import MongoClient dari mongodb native driver
const cors = require("cors");
const app = express();
const port = 5000;

// Enable CORS (if needed)
app.use(cors());
app.use(express.json());

// MongoDB URI (replace with your actual URI)
const uri =
  "mongodb+srv://renanda:renanda123@cluster0.9ogee.mongodb.net/retryWrites=true&w=majority&appName=Cluster0";

// Inisialisasi MongoClient dengan opsi useUnifiedTopology
const client = new MongoClient(uri, {
  useUnifiedTopology: true, // Enable the new discovery and monitoring engine
});

// API route to get the flood data
app.get("/api/floods", async (req, res) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the "Banjir" collection in the "SIG" database
    const database = client.db("SIG");
    const collection = database.collection("DataBanjir");

    // Fetch all documents from the "Banjir" collection
    const floods = await collection.find().toArray(); // Query your collection

    // Map the results to GeoJSON format
    const geoJsonData = {
      type: "FeatureCollection",
      features: floods,
    };

    // Send the GeoJSON data as a response
    res.json(geoJsonData);
  } catch (err) {
    console.log("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  } finally {
    // Close the MongoDB connection after the operation is complete
    await client.close();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});