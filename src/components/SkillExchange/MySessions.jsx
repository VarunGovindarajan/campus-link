import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Check, X, MessageCircle, Star } from 'lucide-react';
import ChatModal from './ChatModal'; // Import the new ChatModal

const MySessions = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        try {
            const res = await api.get('/bookings/my-sessions');
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus });
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error("Failed to update booking status", error);
        }
    };
    
    const handleOpenChat = (booking) => {
        setSelectedBooking(booking);
        setIsChatOpen(true);
    };

    const renderActions = (booking) => {
        // FIX: Add a check to ensure booking.tutor exists
        const isTutor = booking.tutor && booking.tutor._id === user.id;
        
        if (booking.status === 'pending' && isTutor) {
            return (
                <>
                    <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200" title="Confirm"><Check className="w-5 h-5" /></button>
                    <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Cancel"><X className="w-5 h-5" /></button>
                </>
            );
        }

        if (booking.status === 'confirmed') {
            const isSessionPast = new Date(booking.sessionTime) < new Date();
            return (
                <>
                    {/* This button now opens the chat modal */}
                    <button onClick={() => handleOpenChat(booking)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200" title="Open Chat"><MessageCircle className="w-5 h-5" /></button>
                    
                    {isSessionPast && !isTutor && (
                        <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200" title="Mark as Complete"><Star className="w-5 h-5" /></button>
                    )}
                </>
            );
        }

        return null; // No actions for completed/cancelled
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Tutoring & Learning Sessions</h3>
            <div className="space-y-4">
                {bookings.length > 0 ? bookings.map(booking => {
                    // FIX: Add defensive checks to prevent rendering if data is missing
                    if (!booking.skill || !booking.tutor || !booking.learner) {
                        return (
                            <div key={booking._id} className="border p-4 rounded-lg bg-gray-50">
                                <p className="text-gray-500">This booking contains incomplete data and cannot be displayed.</p>
                            </div>
                        );
                    }
                    return (
                        <div key={booking._id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <p className="font-bold text-lg">{booking.skill.skillName}</p>
                                <p className="text-sm text-gray-600">
                                    {booking.tutor._id === user.id ? `Learner: ${booking.learner.name}` : `Tutor: ${booking.tutor.name}`}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{new Date(booking.sessionTime).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                                {getStatusBadge(booking.status)}
                                {renderActions(booking)}
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-center text-gray-500 py-4">You have no active or past sessions.</p>
                )}
            </div>
            
            {/* Render the chat modal when it's open */}
            {isChatOpen && selectedBooking && (
                <ChatModal 
                    user={user}
                    booking={selectedBooking}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default MySessions;
