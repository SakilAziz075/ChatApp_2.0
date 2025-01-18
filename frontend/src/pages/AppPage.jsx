import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import Navbar from '../components/Navbar'; 
import { UserProvider } from '../contexts/UserContext';

const AppPage = () => {
    return (
        <UserProvider>
            <div className="flex flex-col ">
                
                <Navbar />
                
                <div className="flex flex-row-1 h-screen w-full">
                    <Sidebar />           
                             
                    {/* Chat Area */}
                    <div className='w-full'>
                        <Chat />
                    </div>
                </div>
                
            </div>
        </UserProvider>
    );
};

export default AppPage;
