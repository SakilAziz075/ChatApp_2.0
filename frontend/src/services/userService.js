import api from './api';

export const fetchAllUsers = async () => {
    const response = await api.get('/user/profile'); 
    console.log('all users' , response.data.users);
    
    return response.data.users;
};
