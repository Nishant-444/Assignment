// Import required packages
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();

// Initialize Express
const app = express();
// Use body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Configure MySQL database connection
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

// Establish connection to the database
db.connect((err) => {
	if (err) throw err;
	console.log("MySQL connected...");
});

// --- API Routes ---

// POST route to add a new school
app.post("/addSchool", (req, res) => {
	const { name, address, latitude, longitude } = req.body;
	if (!name || !address || latitude == null || longitude == null) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
	db.query(sql, [name, address, latitude, longitude], (err, result) => {
		if (err) throw err;
		res.json({
			message: "School added successfully",
			schoolId: result.insertId,
		});
	});
});

// GET route to list schools, sorted by proximity
app.get("/listSchools", (req, res) => {
	const userLat = parseFloat(req.query.latitude);
	const userLon = parseFloat(req.query.longitude);

	if (isNaN(userLat) || isNaN(userLon)) {
		return res
			.status(400)
			.json({ error: "Latitude and Longitude are required" });
	}

	// SQL query using Haversine formula to calculate distance
	const sql =
		"SELECT *, (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(latitude)))) AS distance FROM schools ORDER BY distance";

	db.query(sql, [userLat, userLon, userLat], (err, results) => {
		if (err) throw err;
		res.json(results);
	});
});

// Start the server on port 3000
app.listen(3000, () => {
	console.log("Server running on port 3000");
});
