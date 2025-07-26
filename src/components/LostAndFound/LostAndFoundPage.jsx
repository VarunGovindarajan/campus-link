import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import LostFoundModal from './LostFoundModal';
import CommentSection from './CommentSection';
import MatchesModal from './MatchesModal'; // Import the new AI modal
import { Plus, MapPin, Clock, Trash2, MessageSquare } from 'lucide-react';

const LostAndFoundPage = ({ user }) => {
    const [items, setItems] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [filters, setFilters] = useState({ category: 'All', date: '' });
    const [activeCommentSection, setActiveCommentSection] = useState(null);
    
    // --- NEW: State for the AI Matching Modal ---
    const [showMatchesModal, setShowMatchesModal] = useState(false);
    const [lastLostItem, setLastLostItem] = useState(null);

    const fetchItems = useCallback(async () => {
        try {
            const res = await api.get('/lost-and-found');
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleReportItem = async (formData) => {
        try {
            // The backend now expects multipart/form-data because of the image
            const res = await api.post('/lost-and-found', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // After successfully reporting, refresh the list
            fetchItems();

            // --- NEW: Trigger AI search if the item was 'lost' ---
            if (res.data && res.data.type === 'lost') {
                setLastLostItem(res.data); // Store the newly created lost item
                setShowMatchesModal(true); // Open the AI matches modal
            }
        } catch (error) {
            console.error("Failed to report item", error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`/lost-and-found/${itemId}`);
                fetchItems();
            } catch (error) {
                console.error("Failed to delete item", error);
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredItems = items.filter(item => {
        const categoryMatch = filters.category === 'All' || item.category === filters.category;
        const dateMatch = !filters.date || new Date(item.createdAt).toISOString().slice(0, 10) === filters.date;
        return categoryMatch && dateMatch;
    });

    const toggleComments = (itemId) => {
        setActiveCommentSection(activeCommentSection === itemId ? null : itemId);
    };

    return (
        <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Lost & Found</h2>
                <button onClick={() => setShowReportModal(true)} className="flex items-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors">
                    <Plus className="w-5 h-5 mr-2" /> Report an Item
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-gray-600">Filter by Category</label>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-lg mt-1">
                        <option>All</option><option>Electronics</option><option>Bottles</option><option>Stationery</option><option>Documents</option><option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600">Filter by Date</label>
                    <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full p-2 border rounded-lg mt-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map(item => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                        <img src={item.imageUrl} alt={item.item} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/ffffff?text=Image+Error'; }} />
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex-grow">
                                <span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}>{item.type.toUpperCase()}</span>
                                <h3 className="text-lg font-bold text-gray-800 mt-2">{item.item}</h3>
                                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {item.location}</p>
                                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Reported by {item.reporter.name} on {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-2 border-t">
                                <button onClick={() => toggleComments(item._id)} className="flex items-center text-sm text-blue-600 hover:underline">
                                    <MessageSquare className="w-4 h-4 mr-1" /> Comments
                                </button>
                                {user.id === item.reporter._id && (
                                    <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Delete Post">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            {activeCommentSection === item._id && <CommentSection item={item} user={user} />}
                        </div>
                    </div>
                ))}
            </div>
            
            {showReportModal && <LostFoundModal onClose={() => setShowReportModal(false)} onReport={handleReportItem} />}
            
            {/* --- NEW: Render the AI Matches Modal when active --- */}
            {showMatchesModal && lastLostItem && (
                <MatchesModal 
                    lostItem={lastLostItem}
                    onClose={() => setShowMatchesModal(false)}
                />
            )}
        </div>
    );
};
export default LostAndFoundPage;
