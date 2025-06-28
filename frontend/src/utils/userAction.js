import api from '../services/api';

export const handleLogout = async () => {
  try {
    console.log('logging out...');
    localStorage.removeItem('email');
    localStorage.removeItem('token');

    await api.post('auth/logout');

    window.location.href = '/';
  } catch (error) {
    console.error('Error during logout', error);
  }
};

export const handleNewGroup = (setShowGroupModal) => {
  setShowGroupModal(true);
};
