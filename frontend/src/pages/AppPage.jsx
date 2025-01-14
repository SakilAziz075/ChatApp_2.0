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
            <div className=" bg-gray-100 p-1.5"></div>
            <Chat/>
            
        </div>

</UserProvider>
    );
};

export default AppPage;
