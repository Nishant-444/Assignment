# 📚 School Management API

A Node.js + Express.js + MySQL REST API for managing schools.  
This project allows you to **add schools** and **list schools sorted by proximity** to a user's location.

---

## 🚀 Features

- **Add School API**  
  Accepts a school's name, address, latitude, and longitude, and stores it in the MySQL database.
- **List Schools API**  
  Accepts the user's latitude and longitude and returns a list of schools sorted by nearest distance.
- **Validation**  
  Ensures all fields are provided and in the correct format before inserting data.
- **MySQL Integration**  
  Fully integrated with a MySQL database using the `mysql2` Node.js driver.

---

## 🗄 Database Setup

1. Open MySQL Workbench or your MySQL CLI.
2. Create the database and table:

```sql
CREATE DATABASE school_management;
USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/school-management-api.git
cd school-management-api
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the root folder and add your database details:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=school_management
PORT=3000
```

### Start the server

```bash
npm run start
```

If successful, you'll see:

```
Server running on port 3000
MySQL connected...
```

---

## 📡 API Endpoints

### 1️⃣ Add School

**Endpoint:** `POST /addSchool`  
**Headers:** `Content-Type: application/json`

**Payload Example:**

```json
{
	"name": "Green Valley High School",
	"address": "123 Main Street",
	"latitude": 40.73061,
	"longitude": -73.935242
}
```

**Success Response:**

```json
{
	"message": "School added successfully",
	"schoolId": 1
}
```

**Validations:**

- All fields are required
- Latitude & longitude must be numbers

### 2️⃣ List Schools (sorted by proximity)

**Endpoint:** `GET /listSchools`

**Query Parameters:**

- `latitude` (number, required)
- `longitude` (number, required)

**Example Request:**

```bash
GET http://localhost:3000/listSchools?latitude=40.73061&longitude=-73.935242
```

**Success Response:**

```json
[
	{
		"id": 1,
		"name": "Green Valley High School",
		"address": "123 Main Street",
		"latitude": 40.73061,
		"longitude": -73.935242,
		"distance": 0
	},
	{
		"id": 2,
		"name": "Lakeside Elementary",
		"address": "456 Lake Road",
		"latitude": 40.750504,
		"longitude": -73.993439,
		"distance": 5.1
	}
]
```

---

## 🧪 Postman Collection

A Postman collection is included for testing the APIs with sample data.

**Import the collection:**

1. Open Postman.
2. Click Import → Upload file.
3. Select `SchoolAPI.postman_collection.json` (included in this repo).

**Run:**

- Add School - Example 1
- Add School - Example 2
- List Schools

---

## 🌍 Deployment

You can deploy this API using:

- **Render**
- **Railway**
- **Heroku**
- **Vercel** (with Serverless Functions)

Make sure to update `.env` with your production database credentials before deploying.

---

## 📂 Project Structure

```
school-management-api/
│
├── server.js              # Main server file
├── package.json           # Project metadata & dependencies
├── .env                   # Environment variables
├── README.md              # Documentation
└── SchoolAPI.postman_collection.json  # Postman test collection
```

---

## 📞 Contact

For questions or improvements:

- **Name:** Nishant Sharma
- **Email:** business.nishant777@gmail.com
- **GitHub:** [@Nishant-444](https://github.com/Nishant-444)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
