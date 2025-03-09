import React from 'react';
import RoomCard from './RoomCard';

const RoomList = ({ rooms, onRoomClick }) => {
  if (rooms.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">No rooms found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {rooms.map(room => (
        <RoomCard 
          key={room.roomID} 
          room={room} 
          onClick={() => onRoomClick(room)} 
        />
      ))}
    </div>
  );
};

export default RoomList;