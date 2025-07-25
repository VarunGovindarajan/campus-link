import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AnnouncementModal from './AnnouncementModal';
import { Plus } from 'lucide-react';

const AnnouncementsPage = ({ user }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchAnnouncements = useCallback(async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleAddAnnouncement = async (newAnnouncement) => {
        try {
            await api.post('/announcements', newAnnouncement);
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to add announcement", error);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Campus Announcements</h2>
                {user.role === 'admin' && (
                    <button onClick={() => setShowModal(true)} className="flex items-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors">
                        <Plus className="w-5 h-5 mr-2" /> New Announcement
                    </button>
                )}
            </div>
            <div className="space-y-6">
                {announcements.length > 0 ? announcements.map(announcement => (
                    <div key={announcement._id} className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                            <span className="text-sm text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 mt-3">{announcement.content}</p>
                    </div>
                )) : <p className="text-center text-gray-500">No announcements yet.</p>}
            </div>
            {showModal && <AnnouncementModal onClose={() => setShowModal(false)} onAdd={handleAddAnnouncement} />}
        </div>
    );
};

export default AnnouncementsPage;
