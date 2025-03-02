import React , { useState } from "react";
import api from '../services/api'
import ProfilePictureModal from "./ProfilePictureModal";

const Navbar = ()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = async ()=>{

        try {
            console.log('logging out...')
            localStorage.removeItem('email')
            localStorage.removeItem('token')
    
            await api.post('auth/logout');
    
            // Redirect to login page or home page
            window.location.href = '/'
        } 
        
        catch (error) {
            console.error('Error during logout', error);
        }
    }

    const handleChangeProfile = ()=>{
        setIsModalOpen(true);
    }

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const response = await api.post("/user/upload-profile-pic", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                alert("Profile picture updated successfully!");
                setIsModalOpen(false); // Close modal after successful upload
            } 
 
            else 
            {
                alert("Failed to update profile picture");
            }

        } 
        
        catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };


    const handleNewGroup = ()=>{

    }





    return (
        <nav className="bg-blue-400 text-gray-900">
            <div>
                <div className="flex flex-row justify-around">
                    <button className="p-2 rounded-md m-2 hover:bg-blue-800" onClick={handleNewGroup}>
                        New Group
                    </button>
                    <button className="p-2 rounded-md m-2 hover:bg-blue-800" onClick={handleChangeProfile}>
                        Profile
                    </button>
                    <button className="p-2 rounded-md m-2 hover:bg-blue-800" onClick={handleLogout}>
                        Log-out
                    </button>
                </div>
            </div>

            {/* Profile Picture Modal */}
            <ProfilePictureModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onUpload={handleUpload} 
            />
        </nav>
    );
};

export default Navbar;