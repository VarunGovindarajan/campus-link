import React, { useState, useEffect } from 'react';

const OpportunityModal = ({ onClose, onSave, opportunity }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Internship',
        description: '',
        link: '',
        deadline: ''
    });

    useEffect(() => {
        if (opportunity) {
            // Format date for the datetime-local input if it exists
            const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline).toISOString().slice(0, 16) : '';
            setFormData({
                title: opportunity.title,
                type: opportunity.type,
                description: opportunity.description,
                link: opportunity.link,
                deadline: deadlineDate
            });
        }
    }, [opportunity]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure deadline is not an empty string before saving
        const dataToSave = { ...formData };
        if (!dataToSave.deadline) {
            delete dataToSave.deadline;
        }
        onSave(dataToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">
                    {opportunity ? 'Edit Opportunity' : 'Post New Opportunity'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-3 border rounded-lg" required />
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg">
                        <option>Internship</option>
                        <option>Hackathon</option>
                        <option>Tech News</option>
                        <option>Workshop</option>
                    </select>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-lg h-24" required />
                    <input name="link" value={formData.link} onChange={handleChange} placeholder="https://example.com/apply" type="url" className="w-full p-3 border rounded-lg" required />
                    <div>
                        <label className="text-sm font-medium text-gray-700">Deadline (Optional)</label>
                        <input name="deadline" value={formData.deadline} onChange={handleChange} type="datetime-local" className="w-full p-3 border rounded-lg mt-1" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">
                            {opportunity ? 'Save Changes' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpportunityModal;
