import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

const AppPage = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Chat Area */}
            <div className="flex-1 bg-gray-100 p-4"></div>

            <Chat/>
            
        </div>
    );
};

export default AppPage;
