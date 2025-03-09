import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Plus, Trash2, Upload } from 'lucide-react';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'quad', label: 'Quad' },
  { value: 'double', label: 'Double' },
  { value: 'triple', label: 'Triple' }
];

const AddEditRoomModal = ({ isOpen, onRequestClose, selectedRoom, onAddRoom, onUpdateRoom }) => {
  const [formData, setFormData] = useState({
    roomID: '',
    room_type: 'standard',
    bed_type: '',
    price: '',
    is_occupied: false,
    doNotDisturb: false,
    requestCleaning: false,
    requestMaintenance: false,
    description: '',
    maxOccupancy: 2,
    images: []
  });

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        ...selectedRoom,
        price: parseFloat(selectedRoom.price)
      });
    } else {
      setFormData({
        roomID: '',
        room_type: 'standard',
        bed_type: '',
        price: '',
        is_occupied: false,
        doNotDisturb: false,
        requestCleaning: false,
        requestMaintenance: false,
        description: '',
        maxOccupancy: 2,
        images: []
      });
    }
  }, [selectedRoom, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageAdd = () => {
    const newImage = { id: Date.now(), image: '' };
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const handleImageChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === id ? { ...img, image: value } : img
      )
    }));
  };

  const handleFileUpload = async (id, file) => {
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleImageChange(id, e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleImageRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      price: parseFloat(formData.price),
      images: formData.images.filter(img => img.image.trim() !== '')
    };
    
    if (selectedRoom) {
      onUpdateRoom(roomData);
    } else {
      onAddRoom(roomData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-xl p-4 md:p-8 w-[95%] md:w-full max-w-2xl border border-gray-700"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {selectedRoom ? 'Edit Room' : 'Add New Room'}
        </h2>
        <button
          onClick={onRequestClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Room ID</label>
            <input
              type="text"
              name="roomID"
              value={formData.roomID}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
              required
              disabled={selectedRoom}
              maxLength={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Room Type</label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
              required
            >
              {ROOM_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">Room Images</label>
            <button
              type="button"
              onClick={handleImageAdd}
              className="text-amber-300 hover:text-amber-400 transition-colors flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image
            </button>
          </div>
          <div className="space-y-2">
            {formData.images.map((img, index) => (
              <div key={img.id} className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={img.image}
                    onChange={(e) => handleImageChange(img.id, e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(img.id, e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="h-full px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:text-amber-300 transition-colors flex items-center"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleImageRemove(img.id)}
                  className="px-2 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bed Type</label>
            <input
              type="text"
              name="bed_type"
              value={formData.bed_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
              required
              maxLength={40}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price per Night</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_occupied"
              checked={formData.is_occupied}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-300 focus:ring-amber-300 bg-gray-700 border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-300">Occupied</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="doNotDisturb"
              checked={formData.doNotDisturb}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-300 focus:ring-amber-300 bg-gray-700 border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-300">Do Not Disturb</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="requestCleaning"
              checked={formData.requestCleaning}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-300 focus:ring-amber-300 bg-gray-700 border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-300">Request Cleaning</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="requestMaintenance"
              checked={formData.requestMaintenance}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-300 focus:ring-amber-300 bg-gray-700 border-gray-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-300">Request Maintenance</label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-300 text-gray-900 rounded-md hover:bg-amber-400 transition-colors w-full md:w-auto"
          >
            {selectedRoom ? 'Save Changes' : 'Add Room'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditRoomModal;