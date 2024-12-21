// npm install express mongodb
// start : node server.js

// Import necessary modules
const express = require("express");
const multer = require('multer');
const path = require('path');
const { MongoClient } = require("mongodb"); // Import MongoClient dari mongodb native driver
const cors = require("cors");
const app = express();
const port = 5000;
const fs = require('fs');

// Enable CORS (if needed)
app.use(cors());
app.use(express.json());

// MongoDB URI (replace with your actual URI)
const uri =
  "mongodb+srv://renanda:renanda123@cluster0.9ogee.mongodb.net/retryWrites=true&w=majority&appName=Cluster0";

// Inisialisasi MongoClient dengan opsi useUnifiedTopology
const client = new MongoClient(uri);

// Set up Multer for file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');  // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  }
});

const upload = multer({ storage: storage });

// API route to get the flood data
app.get("/api/banjir", async (req, res) => {
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

// API route to get the flood data
app.get("/api/tabel", async (req, res) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the "Banjir" collection in the "SIG" database
    const database = client.db("SIG");
    const collection = database.collection("DataBanjir");

    // Fetch all documents from the "Banjir" collection
    const floods = await collection.find().sort({ id: 1 }).toArray(); // Query your collection

    // Map the results to include only specific properties in the response
    const formattedFloods = floods.map(flood => (flood.properties));

    // Send the formatted array as a response
    res.json({ floods: formattedFloods });
  } catch (err) {
    console.log("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  } finally {
    // Close the MongoDB connection after the operation is complete
    await client.close();
  }
});

app.post("/api/banjir",upload.single('foto'),async (req, res) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the "Banjir" collection in the "SIG" database
    const database = client.db("SIG");
    const collection = database.collection("DataBanjir");
    const { fid, nama, x, y, foto } = req.body;

    const newData = {
      "type" : "Feature",
      "id" : parseInt(fid),
      "geometry" : {
        "type" : "Point",
        "coordinates" : [
          parseFloat(x),
          parseFloat(y)
        ]
      },
      "properties" : {
        "FID" : parseInt(fid),
        "NAMA" : nama,
        "X" : parseFloat(x),
        "Y" : parseFloat(y),
        "FOTO" : req.file.path
      }
    };

    const result = await collection.insertOne(newData);
    // Send a response with the inserted document ID
    res.status(201).json({ message: "Data inserted successfully", id: result.insertedId });
  } catch (err) {
    console.log("Error inserting data:", err);
    res.status(500).send("Error inserting data");
  } finally {
    // Close the MongoDB connection after the operation is complete
    await client.close();
  }
});

app.delete("/api/banjir/:banjirId", async (req, res) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the "Banjir" collection in the "SIG" database
    const database = client.db("SIG");
    const collection = database.collection("DataBanjir");

    // Get the `banjirId` from the request parameters
    const banjirId = parseInt(req.params.banjirId, 10);

    const data = await collection.findOne({ id: banjirId });

    const filePath = data.properties.FOTO;
    fs.unlink(filePath,
      (err => {
          if (err) console.log(err);
          else {
              console.log("\nDeleted file: ",filePath);
          }
      }));
      
    // Attempt to delete the document with the matching `banjirId`
    const result = await collection.deleteOne({ id: banjirId });
    // Check if a document was deleted
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Document deleted successfully" });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).send("Error deleting document");
  } finally {
    // Close the MongoDB connection after the operation is complete
    await client.close();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});