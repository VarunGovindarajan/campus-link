import React from 'react';
import { Edit2, Trash2, ExternalLink, Calendar, Tag } from 'lucide-react';

const OpportunityCard = ({ opportunity, user, onEdit, onDelete }) => {
    
    const getBadgeColor = (type) => {
        switch (type) {
            case 'Internship': return 'bg-blue-100 text-blue-800';
            case 'Hackathon': return 'bg-purple-100 text-purple-800';
            case 'Tech News': return 'bg-green-100 text-green-800';
            case 'Workshop': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between border hover:shadow-lg transition-shadow">
            <div>
                <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getBadgeColor(opportunity.type)}`}>
                        {opportunity.type}
                    </span>
                    {user.role === 'admin' && (
                        <div className="flex space-x-2">
                            <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-600"><Edit2 size={16} /></button>
                            <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-3">{opportunity.title}</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">{opportunity.description}</p>
            </div>
            <div>
                {opportunity.deadline && (
                    <div className="flex items-center text-sm text-red-600 font-semibold mb-3">
                        <Calendar size={16} className="mr-2" />
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </div>
                )}
                <a href={opportunity.link} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900 transition-colors text-sm font-semibold">
                    <ExternalLink size={16} className="mr-2" />
                    {opportunity.type === 'Tech News' ? 'Read More' : 'Apply Now'}
                </a>
            </div>
        </div>
    );
};

export default OpportunityCard;
