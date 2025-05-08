Task Management Backend
This is the backend for a task management application built with Node.js, Express.js, and MongoDB. It provides RESTful APIs for user authentication, task management, and real-time notifications using Socket.IO.
Features

User authentication with JWT (register, login).
CRUD operations for tasks (create, read, update, delete).
Task assignment to users with validation.
Real-time notifications for task assignments.
Task filtering by search, priority, status, and due date.
MongoDB integration for persistent storage.

Technologies

Node.js: Server runtime environment.
Express.js: Web framework for API routing.
MongoDB: NoSQL database for data storage.
Mongoose: ODM for MongoDB.
Socket.IO: Real-time notification system.
JWT: Authentication and authorization.

Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)
MongoDB Atlas account
Render account for deployment
Frontend running (see Frontend README)

Setup Instructions

Clone the Repository:
git clone https://github.com/<your-repo>/task-management-backend.git
cd task-management-backend


Install Dependencies:
npm install


Configure Environment Variables:Create a .env file in the root directory and add:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0testing.advfg.mongodb.net/task-management
JWT_SECRET=<your-secure-jwt-secret>
PORT=5003


MONGODB_URI: MongoDB Atlas connection string.
JWT_SECRET: Secret key for JWT (generate with node -e "console.log(require('crypto').randomBytes(32).toString('base64'))").
PORT: Server port (default 5003).


Run Locally:
npm start

The server runs at http://localhost:5003.


Project Structure
task-management-backend/
├── controllers/        # Route handlers (taskController.js, authController.js)
├── middleware/         # Middleware (auth.js)
├── models/             # Mongoose schemas (Task.js, User.js)
├── routes/             # Express routes (tasks.js, auth.js)
├── src/                # Server entry point (server.js)
├── .env                # Environment variables (not tracked)
├── package.json        # Dependencies and scripts
└── README.md           # This file

API Endpoints

Auth:
POST /api/auth/register: Register a user.
POST /api/auth/login: Login and receive JWT.
GET /api/auth/users: Get all users (authenticated).
GET /api/auth/me: Get current user (authenticated).


Tasks:
POST /api/tasks: Create a task.
GET /api/tasks: Get tasks (supports query params: search, priority, status, dueDate).
PUT /api/tasks/:id: Update a task.
DELETE /api/tasks/:id: Delete a task.



Deployment to Render

Push to GitHub:
git add .
git commit -m "Initial commit"
git push origin main


Set Up Render:

Go to Render and create a new Web Service.
Connect your GitHub repository.
Configure environment variables in Render dashboard:MONGODB_URI=mongodb+srv://<username>:<password>@cluster0testing.advfg.mongodb.net/task-management
JWT_SECRET=<your-secure-jwt-secret>
PORT=5003


Set runtime to Node.js and start command to npm start.


Deploy:

Render automatically deploys on git push.
Access the API at https://task-management-backend-vl3p.onrender.com.



Scripts

npm start: Start the server with node src/server.js.
npm run dev: Start the server with nodemon for development (if installed).

Troubleshooting

MongoDB Errors: Verify MONGODB_URI and network access in MongoDB Atlas.
Socket.IO Issues: Check CORS configuration in server.js and Render logs for Socket.IO client connected.
API Errors: Use Postman to test endpoints (e.g., POST /api/tasks) and check Render logs for errors (e.g., Task created, Fetched tasks).

Security Notes

MongoDB URI: Replace exposed credentials in MONGODB_URI. Create a new MongoDB Atlas user and update the URI.
JWT Secret: Ensure JWT_SECRET is unique and secure.
.env: Add .env to .gitignore to prevent leaking secrets.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

