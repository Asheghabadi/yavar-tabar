import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';
let socket;

export const connectSocket = () => {
    // Prevent multiple connections
    if (socket && socket.connected) {
        return;
    }
    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('Connected to socket server with id:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const joinRoom = (orderId) => {
    if (socket) {
        socket.emit('joinRoom', orderId);
    }
};

export const sendMessage = (orderId, message) => {
    if (socket) {
        socket.emit('sendMessage', { orderId, message });
    }
};

// The callback will be executed when a new message is received
export const onMessageReceived = (callback) => {
    if (socket) {
        socket.on('receiveMessage', (message) => {
            callback(message);
        });
    }
};
