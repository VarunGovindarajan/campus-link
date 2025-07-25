import React, { useState, useEffect } from 'react';

// Import Pages and Components
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Shared/Sidebar';
import AnnouncementsPage from './components/Announcements/AnnouncementsPage';
import LostAndFoundPage from './components/LostAndFound/LostAndFoundPage';
import TimetablePage from './components/Timetable/TimetablePage';
import HostelComplaintsPage from './components/HostelComplaints/HostelComplaintsPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Check for a logged-in user on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setActivePage('dashboard');
    };

    const renderPage = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
        }
        if (!user) {
            return <AuthPage setUser={setUser} />;
        }
        switch (activePage) {
            case 'dashboard':
                return <Dashboard setActivePage={setActivePage} />;
            case 'announcements':
                return <AnnouncementsPage user={user} />;
            case 'lost-and-found':
                return <LostAndFoundPage user={user} />;
            case 'timetable':
                return <TimetablePage user={user} />;
            case 'complaints':
                return <HostelComplaintsPage user={user} />;
            default:
                return <Dashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="flex flex-col lg:flex-row">
                {user && <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout} />}
                <main className="flex-1 transition-all duration-300">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
