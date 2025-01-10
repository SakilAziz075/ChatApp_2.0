import api from './api';

export const fetchAllUsers = async () => {
    const response = await api.get('/user/profile'); 
    return response.data.users;
};
