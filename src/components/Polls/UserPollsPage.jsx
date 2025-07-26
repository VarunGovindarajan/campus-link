import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Adjust path as needed

const UserPollsPage = ({ user }) => {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/polls'); // Fetch all active polls
            setPolls(res.data);
        } catch (err) {
            setError('Failed to fetch polls.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionId) => {
        setError('');
        if (!user) {
            setError('You must be logged in to vote.');
            return;
        }

        try {
            const res = await api.post(`/polls/${pollId}/vote`, { optionId });
            setPolls(prevPolls =>
                prevPolls.map(poll =>
                    poll._id === pollId ? res.data : poll
                )
            );
            alert('Your vote has been cast!');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to cast vote.');
            console.error(err);
        }
    };

    const calculateTotalVotes = (poll) => {
        return poll.options.reduce((sum, option) => sum + option.votes, 0);
    };

    const getUserVote = (poll) => {
        if (!user) return null;
        for (const option of poll.options) {
            if (option.voters.some(voter => voter._id === user.id)) {
                return option._id;
            }
        }
        return null;
    };

    if (loading) return <div className="text-center text-white mt-8">Loading polls...</div>;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Campus Polls & Feedback</h1>

            {error && <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-center">{error}</div>}

            <div className="max-w-4xl mx-auto">
                {polls.length === 0 ? (
                    <p className="text-center text-gray-600">No active polls available at the moment.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-1">
                        {polls.map((poll) => {
                            const totalVotes = calculateTotalVotes(poll);
                            const userVoteId = getUserVote(poll);

                            return (
                                <div key={poll._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{poll.question}</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Type: <span className="font-medium">{poll.isAnonymous ? 'Anonymous' : 'Normal'}</span>
                                    </p>
                                    <div className="space-y-3">
                                        {poll.options.map((option) => (
                                            <div key={option._id} className="w-full relative">
                                                <button
                                                    onClick={() => handleVote(poll._id, option._id)}
                                                    disabled={!!userVoteId || !user}
                                                    className={`
                                                        w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 relative overflow-hidden
                                                        ${userVoteId
                                                            ? (userVoteId === option._id
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 cursor-not-allowed')
                                                            : (user ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed')
                                                        }
                                                        ${!user ? 'opacity-70' : ''}
                                                    `}
                                                >
                                                    {userVoteId && totalVotes > 0 && (
                                                        <div
                                                            className="absolute inset-0 bg-blue-200 opacity-50 z-0"
                                                            style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                                                        ></div>
                                                    )}
                                                    <span className="relative z-10 flex justify-between items-center">
                                                        <span>{option.text}</span>
                                                        {userVoteId && (
                                                            <span className="text-sm font-medium">
                                                                {totalVotes > 0 ? `${((option.votes / totalVotes) * 100).toFixed(1)}%` : '0%'} ({option.votes})
                                                            </span>
                                                        )}
                                                    </span>
                                                </button>
                                                {!poll.isAnonymous && userVoteId && option.voters && option.voters.length > 0 && (
                                                    <div className="text-xs text-gray-600 mt-1 ml-4">
                                                        Voters: {option.voters.map(voter => voter.name).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {userVoteId && (
                                        <p className="text-sm text-gray-600 mt-4 text-center">
                                            You have voted. Total votes: <span className="font-semibold">{totalVotes}</span>
                                        </p>
                                    )}
                                    {!user && (
                                        <p className="text-sm text-red-500 mt-4 text-center">
                                            Please log in to vote on polls.
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPollsPage;
