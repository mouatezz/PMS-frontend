import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Plus, Trash2, Upload, Check } from 'lucide-react';
import api from '../../api.js'
import { use } from 'react';
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'twin', label: 'Twin' },
  { value: 'suite', label: 'Suite' },
  { value: 'quad', label: 'Quad' },
  { value: 'double', label: 'Double' },
  { value: 'triple', label: 'Triple' }
];

const AddEditRoomModal = ({ isOpen, onRequestClose, selectedRoom, onAddRoom, onUpdateRoom, fetchrooms }) => {
  
  // Keep a constant list of all possible amenities
  const [AMENITIES, setAMENITIES] = useState([
    { id: 0, name: 'Loading...' },
  ]);

  const closed = () => {
    getamenities();
     onRequestClose();
  };

  const getamenities = async() =>{
    try{
    const response =await api.get('/backend/hotel_admin/amenities/');
    console.log(response.data);
    setAMENITIES(response.data);
    }catch(err){
        console.error(err);
    }
  }
  
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
    amenities: []
  });

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const currentAmenities = [...(prev.amenities || [])];
      
      if (currentAmenities.includes(amenityId)) {
        return {
          ...prev,
          amenities: currentAmenities.filter(id => id !== amenityId)
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenityId]
        };
      }
    });
  };

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageurls, setimageurls] = useState([]);

  useEffect(() => {
   
    if (selectedRoom) {
      // Extract amenity IDs from the new format
      const amenityIds = [];
      
      if (selectedRoom.amenities && Array.isArray(selectedRoom.amenities)) {
        selectedRoom.amenities.forEach(amenity => {
          // Handle the new array format [id, label]
          if (Array.isArray(amenity) && amenity.length >= 2) {
            const amenityId = Number(amenity[0]);
            if (!isNaN(amenityId)) {
              amenityIds.push(amenityId);
            }
          }
          // Keep previous formats for backward compatibility
          else if (!isNaN(Number(amenity))) {
            amenityIds.push(Number(amenity));
          }
          else if (amenity && typeof amenity === 'object' && !isNaN(Number(amenity.id))) {
            amenityIds.push(Number(amenity.id));
          }
        });
      }
      
      // Update AMENITIES with any new items from the backend, but don't replace the whole list
      if (selectedRoom.amenities && Array.isArray(selectedRoom.amenities)) {
        const newAmenities = [...AMENITIES]; // Start with current list
        
        selectedRoom.amenities.forEach(amenity => {
          if (Array.isArray(amenity) && amenity.length >= 2) {
            const amenityId = Number(amenity[0]);
            const amenityLabel = amenity[1];
            
            // Check if this amenity already exists in our list
            const existingIndex = newAmenities.findIndex(item => item.id === amenityId);
            
            if (existingIndex === -1) {
              // If not found, add it to our list
              newAmenities.push({ id: amenityId, label: amenityLabel });
            }
          }
        });
        
        // Only update if we have new amenities
        if (newAmenities.length > AMENITIES.length) {
          setAMENITIES(newAmenities);
        }
      }
      
      setFormData({
        ...selectedRoom,
        price: parseFloat(selectedRoom.price || 0),
        amenities: amenityIds,
        images: selectedRoom.images || []
      });
      
      setImagePreviews(selectedRoom.images?.map(image => ({ id: image.id, image: image.image })) || []);
      setImageFiles([]);
    } else {
      // Reset form for adding new room
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
        amenities: []
      });
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [selectedRoom, isOpen]);
useEffect(() => {
  getamenities();}, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      const newPreviews = newFiles.map(file => ({
        id: Date.now() + Math.random(),
        image: URL.createObjectURL(file),
        name: file.name
      }));
      
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (id) => {
    setImagePreviews(prev => prev.filter(preview => preview.id !== id));
    setFormData(prevRoom => ({
      ...prevRoom,
      images: prevRoom.images.filter(image => image.id !== id)
    }));
    setimageurls([...imageurls, { id: id }]);
    
    const previewIndex = imagePreviews.findIndex(preview => preview.id === id);
    if (previewIndex < imageFiles.length) {
      setImageFiles(prev => {
        const newFiles = [...prev];
        newFiles.splice(previewIndex, 1);
        return newFiles;
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const amenityIds = formData.amenities.filter(id => !isNaN(Number(id))).map(id => Number(id));
    
    Object.keys(formData).forEach((key) => {
      if (key === 'amenities') {
      } else { 
        data.append(key,formData[key]);
      }
    });
    if (amenityIds.length > 0){
    amenityIds.forEach(id => {
      data.append('amenities', id);
    });
  }else{
    data.append('amenities', "CLEAR");
  }



    imageFiles.forEach((file) => {
      data.append('images', file);
    });
    
    try {
      console.log("Submitting form data:");
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      close();
    
      if (selectedRoom) {
        console.log(data);
        const response = await api.put(`/backend/hotel_admin/rooms/${selectedRoom.roomID}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ); 
      
      console.log("Response:", response.body); 
        
        if (imageurls.length > 0) {
          const deleteResponse = await api.delete('/backend/hotel_admin/roomimages/', {
            data: { urls: imageurls } 
          });
          console.log("Response:", response.body);
          console.log("Delete response:", deleteResponse.body);
        } 
        
        if (response.status == 400 || response.status == 500) {
          alert('Failed to update room!');
        }
        fetchrooms();
      } else {
        const response = await api.post('/backend/hotel_admin/rooms/', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        fetchrooms();
        console.log("Response:", response.body);

        if (response.status == 400 || response.status == 500) {
          alert('Failed to create room!');
        }
      }
    } catch (error) {
      console.log(error);
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
          onClick={closed}
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
            <label className="cursor-pointer text-amber-300 hover:text-amber-400 transition-colors flex items-center text-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              <Plus className="w-4 h-4 mr-1" />
              Add Images
            </label>
          </div>
          
          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {imagePreviews.map(preview => (
                <div key={preview.id} className="relative group">
                  <img
                    src={preview.image}
                    alt={preview.id || "Room image"}
                    className="h-24 w-full object-cover rounded-md border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(preview.id)}
                    className="absolute top-1 right-1 p-1 bg-gray-900 bg-opacity-70 rounded-full text-red-400 hover:text-red-300 transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload button */}
          <div className="mt-2 border-2 border-dashed border-gray-600 rounded-md p-6 text-center">
            <label className="cursor-pointer block w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-400 block">
                Drag and drop images or click to browse
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                JPG, PNG, GIF up to 5MB
              </span>
            </label>
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

        {/* Amenities Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map(amenity => (
              <div 
                key={amenity.id} 
                className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${formData.amenities.includes(amenity.id) 
                    ? 'border-amber-400 bg-amber-400 bg-opacity-10' 
                    : 'border-gray-600 hover:border-gray-500'}
                `}
                onClick={() => handleAmenityToggle(amenity.id)}
              >
                <div className={`checkbox-style ${formData.amenities.includes(amenity.id) ? 'checked' : ''}`}>
                  {formData.amenities.includes(amenity.id) && <Check size={16} />}
                </div>
                <span className="ml-2 text-sm text-gray-300">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={closed}
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