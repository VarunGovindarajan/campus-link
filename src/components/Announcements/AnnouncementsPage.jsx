import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AnnouncementModal from './AnnouncementModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AnnouncementsPage = ({ user }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for modals
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            setError('Failed to fetch announcements.');
            console.error("Failed to fetch announcements", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleSaveAnnouncement = async (announcementData) => {
        try {
            if (editingAnnouncement) {
                // Update existing announcement
                await api.put(`/announcements/${editingAnnouncement._id}`, announcementData);
            } else {
                // Create new announcement
                await api.post('/announcements', announcementData);
            }
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to save announcement", error);
            setError('Failed to save announcement.');
        }
    };
    
    const handleDelete = async (announcementId) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await api.delete(`/announcements/${announcementId}`);
                fetchAnnouncements();
            } catch (err) {
                setError('Failed to delete announcement.');
                console.error(err);
            }
        }
    };

    const handleReaction = async (announcementId, emoji) => {
        try {
            const res = await api.post(`/announcements/${announcementId}/react`, { emoji });
            // The backend now returns the full updated announcement
            setAnnouncements(prev =>
                prev.map(ann => ann._id === announcementId ? res.data : ann)
            );
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add reaction.');
            console.error(err);
        }
    };

    const openModalForEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setShowModal(true);
    };

    const openModalForCreate = () => {
        setEditingAnnouncement(null);
        setShowModal(true);
    };
    
    const closeModal = () => {
        setShowModal(false);
        setEditingAnnouncement(null);
    };

    if (loading) return <div className="text-center p-10">Loading announcements...</div>;

    return (
        <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Campus Announcements</h2>
                {user.role === 'admin' && (
                    <button onClick={openModalForCreate} className="flex items-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors">
                        <Plus className="w-5 h-5 mr-2" /> New Announcement
                    </button>
                )}
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</div>}

            <div className="max-w-4xl mx-auto space-y-6">
                {announcements.length === 0 ? (
                    <p className="text-center text-gray-500">No announcements yet.</p>
                ) : (
                    announcements.map((announcement) => (
                        <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
                                <div className="flex items-center space-x-2">
                                    <p className="text-gray-500 text-sm flex-shrink-0">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                                    {user.role === 'admin' && (
                                        <>
                                            <button onClick={() => openModalForEdit(announcement)} className="p-1 text-blue-500 hover:bg-blue-100 rounded-full"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(announcement._id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4" /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-700 text-base mb-4">{announcement.content}</p>

                            {/* Reaction Section */}
                            <div className="flex flex-wrap gap-2 justify-end items-center">
                                {announcement.reactions.map((reaction) => {
                                    const hasUserReacted = reaction.users.includes(user.id);
                                    return (
                                        <button key={reaction.emoji} onClick={() => handleReaction(announcement._id, reaction.emoji)}
                                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-sm transition-all duration-200 ${hasUserReacted ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                            <span>{reaction.emoji}</span>
                                            <span className="text-xs">{reaction.count}</span>
                                        </button>
                                    );
                                })}
                                <div className="relative group">
                                    <button className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">+</button>
                                    <div className="absolute bottom-full right-0 mb-2 p-1 bg-white rounded-lg shadow-lg hidden group-hover:flex gap-1 border z-10">
                                        {availableEmojis.map((emoji) => (
                                            <button key={emoji} onClick={() => handleReaction(announcement._id, emoji)} className="p-1 text-xl rounded-full hover:bg-gray-200">
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {showModal && <AnnouncementModal onClose={closeModal} onSave={handleSaveAnnouncement} announcement={editingAnnouncement} />}
        </div>
    );
};

export default AnnouncementsPage;
