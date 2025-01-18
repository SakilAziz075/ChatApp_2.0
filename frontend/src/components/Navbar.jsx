import React from "react";
import { Link } from 'react-router-dom'
import api from '../services/api'

const Navbar = ()=>{

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



    const handleNewGroup = ()=>{

    }


    const handleChangeProfile = ()=>{

    }


    return(

        <nav className="bg-blue-400 text-gray-900">
            <div>
                {/* <Link to='/'> ChatApp</Link> */}

                <div className="flex flex-row justify-around">
                    <button className=" p-2 rounded-md m-2 hover:bg-blue-800"> New Group</button>
                    <button className=" p-2 rounded-md m-2 hover:bg-blue-800">Profile</button>
                    <button className=" p-2 rounded-md m-2 hover:bg-blue-800" onClick={handleLogout}> Log-out</button>
                </div>

            </div>

        </nav>

    )



}

export default Navbar;