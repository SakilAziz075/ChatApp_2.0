import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import { UserProvider } from '../contexts/UserContext';

const AppPage = () => {
    return (
        
    <UserProvider>
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Chat Area */}
            <div className="flex-1 bg-gray-100 p-4"></div>

            <Chat/>
            
        </div>

</UserProvider>
    );
};

export default AppPage;
