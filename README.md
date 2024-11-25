COVID-19 India Portal API
This project provides a RESTful API to manage COVID-19 data at the state and district levels in India. It allows users to fetch, update, and manage state and district data, such as cases, cured, active cases, and deaths. The application is built with Node.js, Express.js, and SQLite.

Features
Authentication

Implements JWT-based token authentication to secure routes.
A /login/ endpoint to authenticate users.
State Management

Fetch all states: /states/
Fetch a specific state by ID: /states/:stateId/
Fetch aggregated statistics for a state: /states/:stateId/stats/
District Management

Fetch district details: /districts/:districtId/
Add a new district: /districts/
Update district details: /districts/:districtId/
Delete a district: /districts/:districtId/
Technologies Used
Backend: Node.js, Express.js
Database: SQLite
Authentication: JWT (JSON Web Token)
Encryption: bcrypt
Setup Instructions
Prerequisites
Node.js installed on your machine.
SQLite installed.
Clone the repository:
bash
Copy code
git clone <repository-url>
cd covid19-india-portal
Installation
Install dependencies:

bash
Copy code
npm install
Create the database:

Ensure the covid19IndiaPortal.db file is present in the project root directory.
Import the required schema into the database.
Start the server:

bash
Copy code
node index.js
The server will run on http://localhost:3000/.

API Endpoints
Authentication
POST /login/
Request Body:
json
Copy code
{
  "username": "user1",
  "password": "password123"
}
Response:
json
Copy code
{
  "jwtToken": "your-jwt-token"
}
State Endpoints
GET /states/

Fetch all states.
Response:
json
Copy code
[
  {
    "stateId": 1,
    "stateName": "Andhra Pradesh",
    "population": 5000000
  },
  ...
]
GET /states/:stateId/

Fetch a specific state by ID.
Response:
json
Copy code
{
  "stateId": 1,
  "stateName": "Andhra Pradesh",
  "population": 5000000
}
GET /states/:stateId/stats/

Fetch aggregated COVID-19 statistics for a state.
Response:
json
Copy code
{
  "totalCases": 100000,
  "totalCured": 80000,
  "totalActive": 15000,
  "totalDeaths": 5000
}
District Endpoints
GET /districts/:districtId/

Fetch details of a specific district.
Response:
json
Copy code
{
  "districtId": 1,
  "districtName": "Guntur",
  "stateId": 1,
  "cases": 5000,
  "cured": 4500,
  "active": 400,
  "deaths": 100
}
POST /districts/

Add a new district.
Request Body:
json
Copy code
{
  "stateId": 1,
  "districtName": "Guntur",
  "cases": 5000,
  "cured": 4500,
  "active": 400,
  "deaths": 100
}
Response:
json
Copy code
"District Successfully Added"
PUT /districts/:districtId/

Update details of a specific district.
Request Body:
json
Copy code
{
  "districtName": "Guntur",
  "stateId": 1,
  "cases": 6000,
  "cured": 5500,
  "active": 300,
  "deaths": 200
}
Response:
json
Copy code
"District Details Updated"
DELETE /districts/:districtId/

Delete a specific district.
Response:
json
Copy code
"District Removed"
Environment Variables
The following environment variables are used in the application:

MY_SECRET_TOKEN: Secret key for JWT signing.
Error Handling
401 Unauthorized: Missing or invalid token.
400 Bad Request: Invalid user credentials or data.
500 Internal Server Error: Database or server issues.
Database Schema
User Table
Column Name	Data Type
id	INTEGER
username	TEXT
password	TEXT
State Table
Column Name	Data Type
state_id	INTEGER
state_name	TEXT
population	INTEGER
District Table
Column Name	Data Type
district_id	INTEGER
district_name	TEXT
state_id	INTEGER
cases	INTEGER
cured	INTEGER
active	INTEGER
deaths	INTEGER
License
This project is licensed under the MIT License.









