import React, { useState } from 'react';
import BrowseSkills from './BrowseSkills';
import MySkills from './MySkills';
import MySessions from './MySessions';

const SkillExchangePage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('browse');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'browse':
                return <BrowseSkills user={user} />;
            case 'my-skills':
                return <MySkills user={user} />;
            case 'my-sessions':
                return <MySessions user={user} />;
            default:
                return <BrowseSkills user={user} />;
        }
    };

    return (
        <div className="p-6 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Skill Exchange Marketplace</h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
                <button 
                    onClick={() => setActiveTab('browse')}
                    className={`px-4 py-2 text-lg font-semibold ${activeTab === 'browse' ? 'border-b-2 border-cyan-500 text-cyan-500' : 'text-gray-500'}`}
                >
                    Browse Skills
                </button>
                <button 
                    onClick={() => setActiveTab('my-skills')}
                    className={`px-4 py-2 text-lg font-semibold ${activeTab === 'my-skills' ? 'border-b-2 border-cyan-500 text-cyan-500' : 'text-gray-500'}`}
                >
                    My Skills
                </button>
                <button 
                    onClick={() => setActiveTab('my-sessions')}
                    className={`px-4 py-2 text-lg font-semibold ${activeTab === 'my-sessions' ? 'border-b-2 border-cyan-500 text-cyan-500' : 'text-gray-500'}`}
                >
                    My Sessions
                </button>
            </div>

            {/* Render the active tab's content */}
            <div>
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default SkillExchangePage;
