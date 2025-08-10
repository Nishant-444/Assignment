require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { body, query, validationResult } = require("express-validator");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// MySQL connection pool
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Add School API with improved validation
app.post("/addSchool", (req, res) => {
	const { name, address, latitude, longitude } = req.body;

	// Validation helper
	const isValidLatitude = (lat) =>
		typeof lat === "number" && lat >= -90 && lat <= 90;
	const isValidLongitude = (lon) =>
		typeof lon === "number" && lon >= -180 && lon <= 180;

	// Check name
	if (!name || typeof name !== "string" || name.trim().length === 0) {
		return res.status(400).json({ error: "Name must be a non-empty string" });
	}

	// Check address
	if (!address || typeof address !== "string" || address.trim().length === 0) {
		return res
			.status(400)
			.json({ error: "Address must be a non-empty string" });
	}

	// Check latitude
	if (!isValidLatitude(latitude)) {
		return res
			.status(400)
			.json({ error: "Latitude must be a number between -90 and 90" });
	}

	// Check longitude
	if (!isValidLongitude(longitude)) {
		return res
			.status(400)
			.json({ error: "Longitude must be a number between -180 and 180" });
	}

	// Insert into DB
	const sql =
		"INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
	db.query(
		sql,
		[name.trim(), address.trim(), latitude, longitude],
		(err, result) => {
			if (err) {
				console.error("Database error:", err);
				return res.status(500).json({ error: "Database insert failed" });
			}
			res.json({
				message: "School added successfully",
				schoolId: result.insertId,
			});
		}
	);
});

// List Schools API with validation
app.get("/listSchools", (req, res) => {
	const userLat = parseFloat(req.query.latitude);
	const userLon = parseFloat(req.query.longitude);

	const isValidLatitude = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
	const isValidLongitude = (lon) => !isNaN(lon) && lon >= -180 && lon <= 180;

	// Validation
	if (!isValidLatitude(userLat)) {
		return res
			.status(400)
			.json({ error: "Latitude must be a number between -90 and 90" });
	}
	if (!isValidLongitude(userLon)) {
		return res
			.status(400)
			.json({ error: "Longitude must be a number between -180 and 180" });
	}

	// SQL query to calculate distance and sort
	const sql = `
		SELECT *, 
		(6371 * ACOS(
			COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) 
			+ SIN(RADIANS(?)) * SIN(RADIANS(latitude))
		)) AS distance 
		FROM schools 
		ORDER BY distance
	`;

	db.query(sql, [userLat, userLon, userLat], (err, results) => {
		if (err) {
			console.error("Database error:", err);
			return res.status(500).json({ error: "Database query failed" });
		}
		res.json({
			count: results.length,
			schools: results,
		});
	});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
