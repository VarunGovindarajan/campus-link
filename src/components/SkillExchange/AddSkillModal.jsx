import React, { useState } from 'react';

const AddSkillModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        skillName: '',
        description: '',
        category: 'Technology',
        availability: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">Offer a New Skill</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="skillName"
                        onChange={handleChange}
                        placeholder="What skill can you teach? (e.g., Python Basics)"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <textarea
                        name="description"
                        onChange={handleChange}
                        placeholder="Describe what you'll teach in the session."
                        className="w-full p-3 border rounded-lg h-24"
                        required
                    />
                    <select name="category" onChange={handleChange} value={formData.category} className="w-full p-3 border rounded-lg">
                        <option>Technology</option>
                        <option>Music</option>
                        <option>Languages</option>
                        <option>Arts & Crafts</option>
                        <option>Academics</option>
                        <option>Other</option>
                    </select>
                    <input
                        name="availability"
                        onChange={handleChange}
                        placeholder="Your general availability (e.g., Weekends, Evenings)"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">Add Skill</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSkillModal;
