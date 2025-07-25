import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import LostFoundModal from './LostFoundModal';
import CommentSection from './CommentSection';
import MatchesModal from './MatchesModal';
import ConfirmModal from '../Shared/ConfirmModal';
import { Plus, MapPin, Clock, Trash2, MessageSquare } from 'lucide-react';

const LostAndFoundPage = ({ user }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [filters, setFilters] = useState({ category: 'All', date: '' });
    const [activeCommentSection, setActiveCommentSection] = useState(null);
    const [showMatchesModal, setShowMatchesModal] = useState(false);
    const [lastLostItem, setLastLostItem] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/lost-and-found');
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch items", error);
            setError('Failed to load items. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleReportItem = async (formData) => {
        try {
            const res = await api.post('/lost-and-found', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowReportModal(false);
            fetchItems();
            if (res.data && res.data.type === 'lost') {
                setLastLostItem(res.data);
                setShowMatchesModal(true);
            }
        } catch (error) {
            console.error("Failed to report item", error);
        }
    };

    const handleDeleteItem = (itemId) => {
        setItemToDelete(itemId);
        setShowConfirmModal(true);
    };

    const confirmDeleteItem = async () => {
        if (itemToDelete) {
            try {
                await api.delete(`/lost-and-found/${itemToDelete}`);
                fetchItems();
            } catch (error) {
                console.error("Failed to delete item", error);
            } finally {
                setItemToDelete(null);
                setShowConfirmModal(false);
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

            {loading ? (
                <p className="text-center text-gray-500">Loading items...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.length > 0 ? filteredItems.map(item => (
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
                                        {/* --- FIX APPLIED AS PER YOUR INSTRUCTION --- */}
                                        <p className="flex items-center">
  <Clock className="w-4 h-4 mr-2" /> 
  Reported by {item.reporter?.name || 'an unknown user'} on {new Date(item.createdAt).toLocaleDateString()}
</p>

                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                                    <button onClick={() => toggleComments(item._id)} className="flex items-center text-sm text-blue-600 hover:underline">
                                        <MessageSquare className="w-4 h-4 mr-1" /> Comments
                                    </button>
                                    {/* --- FIX APPLIED AS PER YOUR INSTRUCTION --- */}
                                    {item.reporter && user.id === item.reporter._id && (
                                        <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Delete Post">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                {activeCommentSection === item._id && <CommentSection item={item} user={user} />}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 col-span-full">No items match your filters.</p>
                    )}
                </div>
            )}
            
            {showReportModal && <LostFoundModal onClose={() => setShowReportModal(false)} onReport={handleReportItem} />}
            {showMatchesModal && lastLostItem && <MatchesModal lostItem={lastLostItem} onClose={() => setShowMatchesModal(false)} />}
            {showConfirmModal && <ConfirmModal message="Are you sure you want to delete this post? This action cannot be undone." onConfirm={confirmDeleteItem} onCancel={() => setShowConfirmModal(false)} />}
        </div>
    );
};
export default LostAndFoundPage;
