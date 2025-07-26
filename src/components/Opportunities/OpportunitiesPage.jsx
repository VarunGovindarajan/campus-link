import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import OpportunityModal from './OpportunityModal';
import OpportunityCard from './OpportunityCard';
import { Plus } from 'lucide-react';

const OpportunitiesPage = ({ user }) => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/opportunities');
            setOpportunities(res.data);
        } catch (err) {
            setError('Failed to fetch opportunities.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    const handleSave = async (opportunityData) => {
        try {
            if (editingOpportunity) {
                await api.put(`/opportunities/${editingOpportunity._id}`, opportunityData);
            } else {
                await api.post('/opportunities', opportunityData);
            }
            fetchOpportunities(); // Refresh the list
        } catch (err) {
            console.error('Failed to save opportunity', err);
            setError('Failed to save the opportunity.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/opportunities/${id}`);
                fetchOpportunities(); // Refresh the list
            } catch (err) {
                console.error('Failed to delete opportunity', err);
                setError('Failed to delete the opportunity.');
            }
        }
    };
    
    const openModalForCreate = () => {
        setEditingOpportunity(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (opportunity) => {
        setEditingOpportunity(opportunity);
        setIsModalOpen(true);
    };

    const filteredOpportunities = opportunities.filter(op => 
        filter === 'All' || op.type === filter
    );

    const filterTypes = ['All', 'Internship', 'Hackathon', 'Tech News', 'Workshop'];

    return (
        <div className="p-6 md:p-10">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Tech News & Opportunities</h2>
                {user.role === 'admin' && (
                    <button onClick={openModalForCreate} className="flex items-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors">
                        <Plus className="w-5 h-5 mr-2" /> Post Opportunity
                    </button>
                )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
                {filterTypes.map(type => (
                    <button key={type} onClick={() => setFilter(type)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === type ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {type}
                    </button>
                ))}
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!loading && filteredOpportunities.map(op => (
                    <OpportunityCard 
                        key={op._id} 
                        opportunity={op} 
                        user={user}
                        onEdit={() => openModalForEdit(op)}
                        onDelete={() => handleDelete(op._id)}
                    />
                ))}
            </div>
            {!loading && filteredOpportunities.length === 0 && <p className="text-center text-gray-500 col-span-full mt-8">No opportunities found for this category.</p>}

            {isModalOpen && (
                <OpportunityModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    opportunity={editingOpportunity}
                />
            )}
        </div>
    );
};

export default OpportunitiesPage;
