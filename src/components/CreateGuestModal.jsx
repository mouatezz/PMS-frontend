import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api'; 
const CreateGuestModal = ({ isOpen, onClose, onGuestCreated, existingGuests }) => {
  const [newGuestData, setNewGuestData] = useState({
    fullname: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    role: 'guest',
  });
  const [usernameValidationStatus, setUsernameValidationStatus] = useState('idle');
  const [usernameValidationMessage, setUsernameValidationMessage] = useState('');

  const resetForm = () => {
    setNewGuestData({
      fullname: '',
      phone: '',
      email: '',
      username: '',
      password: '',
      role: 'guest',
    });
    setUsernameValidationStatus('idle');
    setUsernameValidationMessage('');
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewGuestData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'username') {
      if (value.trim() !== '') {
        await checkUsernameAvailability(value);
      } else {
        setUsernameValidationStatus('idle');
        setUsernameValidationMessage('');
      }
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.trim() === '') {
      setUsernameValidationStatus('idle');
      setUsernameValidationMessage('');
      return;
    }
    
    setUsernameValidationStatus('checking');
    
    try {
      const response = await api.post(`/backend/guest/usercheck/${username}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
console.log('Response:', response.body);
      if (response.status == 302) {
        setUsernameValidationStatus('invalid');
        setUsernameValidationMessage('Username is already taken.');
      } else {
        setUsernameValidationStatus('valid');
        setUsernameValidationMessage('Username is available!');
      }
    } catch (error) {
      setUsernameValidationStatus('invalid');
        setUsernameValidationMessage('Username is already taken!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newGuestData.fullname || !newGuestData.phone || !newGuestData.email || 
        !newGuestData.username || !newGuestData.password) {
      alert('Please fill all fields for the new guest.');
      return;
    }
    
    if (usernameValidationStatus !== 'valid') {
      alert('Please choose a valid and available username for the new guest.');
      return;
    }
    
    try {
       const response = await api.post('/backend/register/', newGuestData);
       if (response.status === 201) {
        onGuestCreated();
         resetForm();
         onClose();
       } else {
         alert('Failed to create new guest. Please try again.');
         onClose();
       }
    } catch (error) {
      console.error('Error creating guest:', error);
      alert('Failed to create new guest. Please try again.');
      
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
      

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullname" 
                value={newGuestData.fullname} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={newGuestData.phone} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={newGuestData.email} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                value={newGuestData.password} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                name="username" 
                value={newGuestData.username} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              />
              
              {usernameValidationStatus === 'checking' && (
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-1" /> Checking...
                </p>
              )}
              
              {usernameValidationStatus === 'valid' && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> {usernameValidationMessage}
                </p>
              )}
              
              {usernameValidationStatus === 'invalid' && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> {usernameValidationMessage}
                </p>
              )}
              
              {usernameValidationStatus === 'error' && (
                <p className="text-sm text-red-500 mt-1">{usernameValidationMessage}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Username will be used for guest login.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition duration-200"
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className={`px-4 py-2 text-white font-medium rounded-md transition duration-200 ${
                usernameValidationStatus !== 'valid' || 
                !newGuestData.fullname || 
                !newGuestData.phone || 
                !newGuestData.email || 
                !newGuestData.username || 
                !newGuestData.password
                  ? 'bg-amber-300 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
              disabled={
                usernameValidationStatus !== 'valid' || 
                !newGuestData.fullname || 
                !newGuestData.phone || 
                !newGuestData.email || 
                !newGuestData.username || 
                !newGuestData.password
              }
            >
              Create Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuestModal;