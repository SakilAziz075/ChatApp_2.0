import React, { createContext, useContext, useState , useEffect } from "react";
import { fetchAllUsers } from "../services/userService";

const UserContext = createContext();

//custom hook to use UserContext
export const useUsers = ()=>{
    return useContext(UserContext);
}


// UserProvider component to provide the users data to the app
export const UserProvider = ( {children}) => {

    const [users , setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getUsers = async () => {
            try {
                const users = await fetchAllUsers();
                setUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);



    return (
        <UserContext.Provider value={{ users, loading }}>
            {children}
        </UserContext.Provider>
    );
};