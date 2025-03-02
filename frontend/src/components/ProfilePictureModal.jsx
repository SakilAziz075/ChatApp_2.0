import { useState ,useEffect } from "react";
import { useUsers } from "../contexts/UserContext";

const ProfilePictureModal = ({ isOpen , onClose , onUpload})=>{

    const [selectedFile , setSelectedFile] = useState(null);
    const { users } = useUsers();
    const [ currentUser , setCurrentUser] = useState(null)

    useEffect( ()=>{
      const email = localStorage.getItem('email')
      if(email && users.length>0){

        console.log('user list from context API' , users)

        const foundUser = users.find( user => user.email ===email)
        setCurrentUser(foundUser)
      }
    }, [users]);


    const handleFileChange = (event)=>{
        setSelectedFile(event.target.files[0])
    }


    const handleUpload = () => {
        if(selectedFile)
        {
            onUpload(selectedFile);
            onClose()
        }
    }

    if (!isOpen) 
        return null;


    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Change Profile Picture</h2>
  
          {currentUser ? (
            <div className="mb-4">
              <p><strong>Username:</strong> {currentUser.fullName}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
          ) : (
            <p className="mb-4 text-red-500">User not found</p>
          )}
  
          <input type="file" accept="image/*" onChange={handleFileChange} />
  
          <div className="flex justify-end gap-2 mt-4">
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ProfilePictureModal;