import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Book, User as UserIcon, Search } from 'lucide-react';
import BookSessionModal from './BookSessionModal';

const BrowseSkills = ({ user }) => {
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State for the search input

    const fetchSkills = useCallback(async () => {
        try {
            const res = await api.get('/skills');
            setSkills(res.data);
        } catch (error) {
            console.error("Failed to fetch skills", error);
        }
    }, []);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);
    
    const handleBookClick = (skill) => {
        setSelectedSkill(skill);
        setShowBookingModal(true);
    };

    const handleBookingRequest = async (bookingDetails) => {
        try {
            await api.post('/bookings', {
                skill: selectedSkill._id,
                tutor: selectedSkill.tutor._id,
                ...bookingDetails
            });
            // Optionally, show a success message
            setShowBookingModal(false);
        } catch (error) {
            console.error("Failed to create booking", error);
        }
    };

    // Filter skills based on the search term
    const filteredSkills = skills.filter(skill => 
        skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* --- NEW: Search Bar --- */}
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search for a skill (e.g., Python, Guitar, Spanish)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.length > 0 ? filteredSkills.map(skill => (
                    <div key={skill._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-semibold text-cyan-600">{skill.category}</p>
                            <h3 className="text-xl font-bold text-gray-800 mt-1">{skill.skillName}</h3>
                            <p className="text-gray-600 mt-2 text-sm">{skill.description}</p>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <UserIcon className="w-4 h-4 mr-2" />
                                <span>Tutor: {skill.tutor.name}</span>
                            </div>
                            <button 
                                onClick={() => handleBookClick(skill)}
                                className="w-full mt-4 flex items-center justify-center bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
                            >
                                <Book className="w-4 h-4 mr-2" />
                                Request Session
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 col-span-full">No skills found matching your search. Try another keyword!</p>
                )}
            </div>

            {showBookingModal && (
                <BookSessionModal
                    skill={selectedSkill}
                    onClose={() => setShowBookingModal(false)}
                    onBook={handleBookingRequest}
                />
            )}
        </div>
    );
};

export default BrowseSkills;
