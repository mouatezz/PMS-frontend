import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, ChevronRight, Edit2, Trash2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const RoomDetailsModal = ({ isOpen, onRequestClose, room, onEditClick, onDeleteClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) return null;

  const getRoomTypeLabel = (type) => {
    const roomTypes = {
      'standard': 'Standard',
      'deluxe': 'Deluxe',
      'suite': 'Suite',
      'quad': 'Quad',
      'double': 'Double',
      'triple': 'Triple'
    };
    return roomTypes[type] || type;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-xl p-4 md:p-8 w-[95%] md:w-full max-w-4xl border border-gray-700"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            {getRoomTypeLabel(room.room_type)} <span className="text-gray-400">#{room.roomID}</span>
          </h2>
          <button
            onClick={onRequestClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="relative">
              <img 
                src={room.images[currentImageIndex].image}
                alt={`Room ${room.roomID} view ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              {room.images.map((image, idx) => (
                <button
                  key={image.id || idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative rounded-lg overflow-hidden ${
                    currentImageIndex === idx ? 'ring-2 ring-amber-300' : ''
                  }`}
                >
                  <img 
                    src={image.image}
                    alt={`Room ${room.roomID} thumbnail ${idx + 1}`}
                    className="w-full h-16 object-cover"
                  />
                  <div className={`absolute inset-0 bg-black ${
                    currentImageIndex === idx ? 'bg-opacity-0' : 'bg-opacity-50'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Room Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Room ID</p>
                  <p className="text-white">{room.roomID}</p>
                </div>
                <div>
                  <p className="text-gray-400">Price per Night</p>
                  <p className="text-white">£{parseFloat(room.price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Bed Type</p>
                  <p className="text-white">{room.bed_type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Room Type</p>
                  <p className="text-white">{getRoomTypeLabel(room.room_type)}</p>
                </div>
                {room.maxOccupancy && (
                  <div>
                    <p className="text-gray-400">Max Occupancy</p>
                    <p className="text-white">{room.maxOccupancy} People</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${room.is_occupied ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-gray-400">{room.is_occupied ? 'Occupied' : 'Available'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${room.doNotDisturb ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                  <span className="text-gray-400">{room.doNotDisturb ? 'Do Not Disturb' : 'Available for Service'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${room.requestCleaning ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  <span className="text-gray-400">{room.requestCleaning ? 'Cleaning Requested' : 'No Cleaning Request'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${room.requestMaintenance ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                  <span className="text-gray-400">{room.requestMaintenance ? 'Maintenance Requested' : 'No Maintenance Request'}</span>
                </div>
              </div>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Amenities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity, index) => (
                    <li key={index} className="text-gray-400 flex items-center">
                      <ChevronRight className="w-4 h-4 mr-1 text-amber-300" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-400">{room.description || 'No description available.'}</p>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onDeleteClick}
                className="px-4 py-2 flex items-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Room
              </button>
              <button
                onClick={onEditClick}
                className="px-4 py-2 flex items-center bg-amber-300 text-gray-900 rounded-md hover:bg-amber-400 transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;