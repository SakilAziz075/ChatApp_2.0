import api from './api'; 

export const fetchMessages = async () => {
    const response = await api.get(`/message/messages/`); // Get messages for the selected user
    return response.data.message;
};

export const sendMessage = async (senderId, receiverId, message) => {
    await api.post('/message/messages', { senderId, receiverId, message });
};
