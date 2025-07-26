import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import AddSkillModal from './AddSkillModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MySkills = ({ user }) => {
    const [mySkills, setMySkills] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchMySkills = useCallback(async () => {
        try {
            const res = await api.get('/skills/my-skills');
            setMySkills(res.data);
        } catch (error) {
            console.error("Failed to fetch my skills", error);
        }
    }, []);

    useEffect(() => {
        fetchMySkills();
    }, [fetchMySkills]);

    const handleAddSkill = async (skillData) => {
        try {
            await api.post('/skills', skillData);
            fetchMySkills(); // Refresh the list after adding
        } catch (error) {
            console.error("Failed to add skill", error);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Offer a New Skill
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Skills You Offer</h3>
                {mySkills.length > 0 ? (
                    <div className="space-y-3">
                        {mySkills.map(skill => (
                            <div key={skill._id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{skill.skillName}</p>
                                    <p className="text-sm text-gray-500">{skill.category}</p>
                                </div>
                                {/* Future feature: Add Edit/Delete buttons here */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">You haven't offered any skills yet. Click the button above to add one!</p>
                )}
            </div>

            {showAddModal && (
                <AddSkillModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddSkill}
                />
            )}
        </div>
    );
};

export default MySkills;
