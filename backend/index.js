const express = require('express');
require('dotenv').config(); // Load environment variables
const http = require('http');
const { Server } = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // The origin of the React app
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');
const port = process.env.PORT || 3000;

// --- Database Connection ---
// IMPORTANT: In a real application, use environment variables for this!
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));
// --------------------------


app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Hello from Yavar Trabar Backend!');
});

// Import and use auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Import and use user routes
const userRoutes = require('./routes/users.routes');
app.use('/api/users', userRoutes);

// Import and use part routes
const partRoutes = require('./routes/parts.routes');
app.use('/api/parts', partRoutes);

// Import and use order routes
const orderRoutes = require('./routes/orders.routes');
app.use('/api/orders', orderRoutes);


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected with socket id:', socket.id);

    // Join a chat room based on orderId
    socket.on('joinRoom', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room ${orderId}`);
    });

    // Listen for chat messages
    socket.on('sendMessage', ({ orderId, message }) => {
        // Broadcast the message to everyone in the room except the sender
        socket.to(orderId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
