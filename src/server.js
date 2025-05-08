// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const authRoutes = require('./routes/auth');
// const taskRoutes = require('./routes/tasks');
// const notificationRoutes = require('./routes/notifications');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'https://task-management-frontend-sparsh-m5hjzz0nh.vercel.app/',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   },
//   maxHttpBufferSize: 1e6,
//   pingTimeout: 60000,
//   pingInterval: 25000
// });

// app.use(cors({
//   // origin: 'http://localhost:3000',
//   origin: 'https://task-management-frontend-sparsh-m5hjzz0nh.vercel.app/',

//   credentials: true
// }));
// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/notifications', notificationRoutes);

// const MONGODB_URI = process.env.MONGODB_URI;
// if (!MONGODB_URI) {
//   console.error('MONGODB_URI is not defined in .env file');
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1);
// });

// io.on('connection', (socket) => {
//   console.log('Socket.IO client connected:', socket.id);
//   socket.on('join', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined room ${userId}`);
//   });
//   socket.on('disconnect', (reason) => {
//     console.log(`Socket.IO client disconnected: ${socket.id}, reason: ${reason}`);
//   });
// });

// app.set('io', io);

// const PORT = process.env.PORT || 5003;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://task-management-frontend-sparsh-m5hjzz0nh.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  maxHttpBufferSize: 1e6,
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(cors({
  origin: 'https://task-management-frontend-sparsh-m5hjzz0nh.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

io.on('connection', (socket) => {
  console.log('Socket.IO client connected:', socket.id);
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });
  socket.on('disconnect', (reason) => {
    console.log(`Socket.IO client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});