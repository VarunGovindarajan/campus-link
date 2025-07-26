import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AdminPollsPage from './AdminPollsPage'; // Your Admin component
import UserPollsPage from './UserPollsPage';   // Your User component
import CreatePollModal from './CreatePollModal';
import { Plus } from 'lucide-react';

const PollingPage = ({ user }) => {
    const [polls, setPolls] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPolls = useCallback(async () => {
        setLoading(true);
        try {
            // Admins get all polls, students only get active ones
            const endpoint = user.role === 'admin' ? '/polls/all' : '/polls/active';
            const res = await api.get(endpoint);
            setPolls(res.data);
        } catch (error) {
            console.error("Failed to fetch polls", error);
        } finally {
            setLoading(false);
        }
    }, [user.role]);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    // --- Handler Functions for Admin Actions ---
    const handleCreatePoll = async (pollData) => {
        try {
            await api.post('/polls', pollData);
            fetchPolls(); // Refresh list after creating
        } catch (error) {
            console.error("Failed to create poll", error);
        }
    };

    const handleToggleActiveStatus = async (pollId) => {
        try {
            await api.put(`/polls/${pollId}/toggle`);
            fetchPolls(); // Refresh list
        } catch (error) {
            console.error("Failed to toggle poll status", error);
        }
    };

    const handleDeletePoll = async (pollId) => {
        if (window.confirm("Are you sure you want to delete this poll permanently?")) {
            try {
                await api.delete(`/polls/${pollId}`);
                fetchPolls(); // Refresh list
            } catch (error) {
                console.error("Failed to delete poll", error);
            }
        }
    };

    if (loading) return <p className="text-center p-10">Loading polls...</p>;

    return (
        <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Live Polling</h2>
                {/* Only admins see the "Create Poll" button */}
                {user.role === 'admin' && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors">
                        <Plus className="w-5 h-5 mr-2" /> Create Poll
                    </button>
                )}
            </div>

            {/* Conditionally render the correct page based on user role */}
            {user.role === 'admin' ? (
                <AdminPollsPage 
                    polls={polls} 
                    handleToggleActiveStatus={handleToggleActiveStatus} 
                    handleDeletePoll={handleDeletePoll} 
                />
            ) : (
                <UserPollsPage user={user} />
            )}

            {isModalOpen && <CreatePollModal onClose={() => setIsModalOpen(false)} onCreate={handleCreatePoll} />}
        </div>
    );
};

export default PollingPage;
