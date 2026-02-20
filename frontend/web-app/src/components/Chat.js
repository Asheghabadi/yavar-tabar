import React, { useState, useEffect } from 'react';
import { connectSocket, disconnectSocket, joinRoom, sendMessage, onMessageReceived } from '../services/socket';

function Chat({ orderId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Connect to socket and join room
        connectSocket();
        joinRoom(orderId);

        // Listen for incoming messages
        onMessageReceived((message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Disconnect on component unmount
        return () => {
            disconnectSocket();
        };
    }, [orderId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const messagePayload = {
                text: newMessage,
                sender: currentUser.name, // Assuming currentUser object has a name property
                timestamp: new Date(),
            };
            sendMessage(orderId, messagePayload);
            // Add message to local state immediately for better UX
            setMessages(prevMessages => [...prevMessages, messagePayload]);
            setNewMessage('');
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
            <h4>Order Chat</h4>
            <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #eee', padding: '0.5rem', marginBottom: '1rem' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    style={{ width: '80%', padding: '0.5rem' }}
                />
                <button type="submit" style={{ width: '18%', padding: '0.5rem' }}>Send</button>
            </form>
        </div>
    );
}

export default Chat;
