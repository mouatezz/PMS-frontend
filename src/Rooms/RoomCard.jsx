import React from 'react';
import { BedDouble, Users, Info, ChevronRight } from 'lucide-react';

const RoomCard = ({ room, onClick }) => {
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

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 cursor-pointer hover:border-amber-300 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img 
            src={room.images && room.images.length > 0 ? room.images[0].image : '/api/placeholder/400/320'}
            alt={room.room_type}
            className="w-full h-48 md:h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {room.is_occupied && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Occupied
              </span>
            )}
            {room.doNotDisturb && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                DND
              </span>
            )}
          </div>
          <button className="absolute top-2 left-2 bg-gray-900 bg-opacity-50 p-2 rounded-full">
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {getRoomTypeLabel(room.room_type)}
                <span className="ml-2 text-gray-400">#{room.roomID}</span>
              </h3>
              <div className="flex items-center gap-4 text-gray-400 mt-2">
                <div className="flex items-center">
                  <BedDouble className="w-4 h-4 mr-1" />
                  <span>{room.bed_type}</span>
                </div>
                {room.maxOccupancy && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Max {room.maxOccupancy} People</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">£{parseFloat(room.price).toFixed(2)}</div>
              <p className="text-sm text-gray-400">per night</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">{room.description}</p>
          
          <div className="mt-auto flex flex-wrap gap-2">
            {room.requestCleaning && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Cleaning Requested
              </span>
            )}
            {room.requestMaintenance && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Maintenance Requested
              </span>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button className="text-amber-300 hover:text-amber-400 transition-colors flex items-center">
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;