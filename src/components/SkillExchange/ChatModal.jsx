import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';
import { Send } from 'lucide-react';

// Connect to the backend socket server
const socket = io('http://localhost:5001');

const ChatModal = ({ user, booking, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch initial messages and join the socket room
    useEffect(() => {
        // Join the private room for this booking
        socket.emit('join_room', booking._id);

        // Fetch past messages for this chat
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${booking._id}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();

        // Clean up when the component unmounts
        return () => {
            // You might want to implement a 'leave_room' event on your backend
        };
    }, [booking._id]);

    // Listen for incoming messages
    useEffect(() => {
        const messageListener = (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        socket.on('receive_message', messageListener);

        // Clean up the listener
        return () => {
            socket.off('receive_message', messageListener);
        };
    }, []);
    
    // Scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (currentMessage.trim() === '') return;

        const messageData = {
            bookingId: booking._id,
            sender: user.id,
            content: currentMessage,
            createdAt: new Date().toISOString(), // Add timestamp for immediate UI update
        };
        
        // Emit the message through the socket
        await socket.emit('send_message', messageData);
        
        // Also save the message to the database via REST API
        await api.post(`/messages/${booking._id}`, { content: currentMessage });

        // Update our own messages state immediately
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setCurrentMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Chat for: {booking.skill.skillName}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>

                {/* Message Display Area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 ${msg.sender === user.id ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button type="submit" className="p-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
