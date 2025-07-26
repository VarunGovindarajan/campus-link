import React from 'react';
import api from '../../services/api';
// --- FIX: Provide a default empty array for the 'polls' prop ---
const AdminPollsPage = ({ polls = [], handleToggleActiveStatus, handleDeletePoll }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Manage Polls</h2>
            {/* This check will now work safely even if polls is temporarily undefined */}
            {polls.length === 0 ? (
                <p className="text-center text-gray-500">No polls created yet.</p>
            ) : (
                <div className="space-y-6">
                    {polls.map((poll) => (
                        <div key={poll._id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col border">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{poll.question}</h3>
                            <p className={`text-sm font-medium ${poll.isActive ? 'text-green-600' : 'text-red-600'} mb-1`}>
                                Status: {poll.isActive ? 'Active' : 'Inactive'}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                                Type: {poll.isAnonymous ? 'Anonymous' : 'Normal (Voter Names Visible)'}
                            </p>
                            <ul className="space-y-2 mb-4">
                                {poll.options.map((option) => (
                                    <li key={option._id} className="flex justify-between items-center text-gray-600 text-base">
                                        <span>{option.text}</span>
                                        <span className="font-semibold">{option.votes} votes</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto flex space-x-2">
                                <button
                                    onClick={() => handleToggleActiveStatus(poll._id, poll.isActive)}
                                    className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-semibold text-white
                                        ${poll.isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {poll.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleDeletePoll(poll._id)}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPollsPage;
