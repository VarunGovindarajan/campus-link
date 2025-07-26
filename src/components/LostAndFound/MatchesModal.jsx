import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MapPin, Clock } from 'lucide-react';

const MatchesModal = ({ lostItem, onClose }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const findMatches = async () => {
            if (!lostItem) return;
            setLoading(true);
            setError('');
            try {
                const res = await api.post(`/lost-and-found/${lostItem._id}/find-matches`);
                setMatches(res.data);
            } catch (err) {
                console.error("Failed to find AI matches", err);
                setError('Our AI assistant could not find any potential matches at this time.');
            } finally {
                setLoading(false);
            }
        };

        findMatches();
    }, [lostItem]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">AI Assistant Searching...</h3>
                    <p className="text-gray-600 mb-6">We're checking if any of these found items could be yours.</p>
                </div>
                
                {loading && <p className="text-center">Searching...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {matches.length > 0 ? (
                            matches.map(item => (
                                <div key={item._id} className="bg-gray-50 border rounded-lg p-4 flex items-start space-x-4">
                                    <img src={item.imageUrl} alt={item.item} className="w-24 h-24 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <h4 className="font-bold">{item.item}</h4>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                                            <p className="flex items-center"><MapPin className="w-3 h-3 mr-1.5" /> {item.location}</p>
                                            <p className="flex items-center"><Clock className="w-3 h-3 mr-1.5" /> Reported by {item.reporter.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No potential matches found at the moment.</p>
                        )}
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    );
};

export default MatchesModal;
