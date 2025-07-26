import React, { useState } from 'react';

const LostFoundModal = ({ onClose, onReport }) => {
    const [formData, setFormData] = useState({ type: 'lost', item: '', category: 'Electronics', location: '', description: '' });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- UPDATED: We now use FormData to send the image and text fields together ---
        const reportData = new FormData();
        
        // Append all the text fields from the form
        Object.keys(formData).forEach(key => {
            reportData.append(key, formData[key]);
        });

        // Append the image file if one was selected
        if (imageFile) {
            reportData.append('image', imageFile);
        }

        onReport(reportData); // Send the FormData object
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">Report an Item</h3>
                {/* The form's onSubmit still calls our handler */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select name="type" onChange={handleChange} value={formData.type} className="w-full p-3 border rounded-lg">
                        <option value="lost">I Lost an Item</option>
                        <option value="found">I Found an Item</option>
                    </select>
                    <input name="item" onChange={handleChange} placeholder="Item Name" className="w-full p-3 border rounded-lg" required />
                    <input name="location" onChange={handleChange} placeholder="Last Seen Location" className="w-full p-3 border rounded-lg" required />
                    <select name="category" onChange={handleChange} value={formData.category} className="w-full p-3 border rounded-lg">
                        <option>Electronics</option><option>Bottles</option><option>Stationery</option><option>Documents</option><option>Other</option>
                    </select>
                    <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-lg h-24" required />
                    
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image"
                            onChange={handleImageChange}
                            className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default LostFoundModal;
