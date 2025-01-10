import api from './api'; 

export const fetchMessages = async (userEmail) => {
    const response = await api.get(`/message/messages/${userEmail}`); // Get messages for the selected user
    return response.data.messages;
};

export const sendMessage = async (senderId, receiverId, message) => {
    await api.post('/message/messages', { senderId, receiverId, message });
};
