import React, { useState } from 'react';

const BookSessionModal = ({ skill, onClose, onBook }) => {
    const [sessionTime, setSessionTime] = useState('');
    const [learnerMessage, setLearnerMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onBook({ sessionTime, learnerMessage });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Request a Session</h3>
                <p className="text-gray-700 mb-6">For: <span className="font-semibold">{skill.skillName}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sessionTime" className="block text-sm font-medium text-gray-700">Proposed Date & Time</label>
                        <input
                            type="datetime-local"
                            id="sessionTime"
                            value={sessionTime}
                            onChange={(e) => setSessionTime(e.target.value)}
                            className="w-full mt-1 p-3 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="learnerMessage" className="block text-sm font-medium text-gray-700">Message to Tutor (Optional)</label>
                        <textarea
                            id="learnerMessage"
                            value={learnerMessage}
                            onChange={(e) => setLearnerMessage(e.target.value)}
                            placeholder="e.g., I'm a complete beginner, is that okay?"
                            className="w-full mt-1 p-3 border rounded-lg h-24"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">Send Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookSessionModal;
