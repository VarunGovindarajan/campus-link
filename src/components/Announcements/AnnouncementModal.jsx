import React, { useState, useEffect } from 'react';

// The modal now accepts an 'announcement' prop for editing and a general 'onSave' prop
const AnnouncementModal = ({ onClose, onSave, announcement }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Events'
    });

    // This effect runs when the component loads.
    // If an 'announcement' object is passed in, it means we are in "edit" mode.
    // The form state is then pre-filled with the announcement's data.
    useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title,
                content: announcement.content,
                category: announcement.category
            });
        }
    }, [announcement]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Use the versatile 'onSave' for both creating and editing
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">
                    {/* The title and button text change dynamically */}
                    {announcement ? 'Edit Announcement' : 'New Announcement'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Content"
                        className="w-full p-3 border rounded-lg h-32"
                        required
                    />
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                    >
                        <option>Events</option>
                        <option>Exams</option>
                        <option>Holidays</option>
                        <option>Admin</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">
                            {announcement ? 'Save Changes' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnouncementModal;
