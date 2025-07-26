import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Send } from 'lucide-react';

const CommentSection = ({ item, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/${item._id}`);
                setComments(res.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };
        fetchComments();
    }, [item._id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/comments/${item._id}`, { content: newComment });
            setComments([...comments, res.data]); // Add new comment to the list
            setNewComment(''); // Clear input
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold text-gray-700 mb-2">Comments</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment._id} className="bg-gray-100 p-2 rounded-lg">
                        <p className="font-semibold text-sm">{comment.user.name}</p>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                )) : <p className="text-sm text-gray-500">No comments yet.</p>}
            </div>
            <form onSubmit={handleAddComment} className="flex space-x-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a public comment..."
                    className="flex-1 p-2 border rounded-lg text-sm"
                />
                <button type="submit" className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
