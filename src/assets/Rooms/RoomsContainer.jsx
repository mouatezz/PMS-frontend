import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Sidebar from '../../SideBar';
import RoomList from './RoomList';
import RoomFilters from './RoomFilters';
import AddEditRoomModal from './AddEditRoomModal';
import RoomDetailsModal from './RoomDetailsModal';
import { Plus, AlertTriangle } from "lucide-react";

if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const RoomsContainer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addEditModalIsOpen, setAddEditModalIsOpen] = useState(false);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRooms([
      {
        roomID: "101",
        room_type: "standard",
        bed_type: "2 Double Beds",
        price: 1015.10,
        is_occupied: false,
        doNotDisturb: false,
        requestCleaning: false,
        requestMaintenance: false,
        description: "Charming nautical theme.",
        maxOccupancy: 4,
        images: [
          { id: 1, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop" },
          { id: 2, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop" },
          { id: 3, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" }
        ],
        amenities: [
          "Free Wi-Fi",
          "Air Conditioning",
          "Flat-screen TV",
          "Mini Fridge",
          "Coffee Maker"
        ]
      },
      {
        roomID: "102",
        room_type: "deluxe",
        bed_type: "2 Double Beds",
        price: 1175.08,
        is_occupied: true,
        doNotDisturb: true,
        requestCleaning: false,
        requestMaintenance: false,
        description: "Charming nautical theme, with a view of Lake Disney",
        maxOccupancy: 4,
        images: [
          { id: 4, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop" },
          { id: 5, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" }
        ],
        amenities: [
          "Lake View",
          "Free Wi-Fi",
          "Air Conditioning",
          "Flat-screen TV",
          "Mini Fridge",
          "Coffee Maker"
        ]
      }
    ]);
  }, []);

  const handleAddRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
    setAddEditModalIsOpen(false);
  };

  const handleUpdateRoom = (updatedRoom) => {
    setRooms(rooms.map(room => 
      room.roomID === updatedRoom.roomID ? updatedRoom : room
    ));
    setAddEditModalIsOpen(false);
  };

  const handleDeleteRoom = () => {
    setRooms(rooms.filter(room => room.roomID !== selectedRoom.roomID));
    setDeleteModalIsOpen(false);
    setDetailsModalIsOpen(false);
    setSelectedRoom(null);
  };

  const handleOpenAddModal = () => {
    setSelectedRoom(null);
    setAddEditModalIsOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setSelectedRoom(room);
    setAddEditModalIsOpen(true);
  };

  const handleOpenDetailsModal = (room) => {
    setSelectedRoom(room);
    setDetailsModalIsOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setDetailsModalIsOpen(false); // Close details modal first
    setTimeout(() => setDeleteModalIsOpen(true), 100); // Open delete modal with a slight delay
  };

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'all' || room.room_type === filterType;
    const matchesSearch = room.roomID.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-white">Choose Room</h1>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 bg-amber-300 text-gray-900 rounded-md hover:bg-amber-400 transition-colors w-full md:w-auto justify-center md:justify-start"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Room
            </button>
          </div>

          <RoomFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <RoomList 
            rooms={filteredRooms} 
            onRoomClick={handleOpenDetailsModal} 
          />
        </div>
      </div>

      <AddEditRoomModal
        isOpen={addEditModalIsOpen}
        onRequestClose={() => setAddEditModalIsOpen(false)}
        selectedRoom={selectedRoom}
        onAddRoom={handleAddRoom}
        onUpdateRoom={handleUpdateRoom}
      />

      <RoomDetailsModal
        isOpen={detailsModalIsOpen}
        onRequestClose={() => setDetailsModalIsOpen(false)}
        room={selectedRoom}
        onEditClick={() => {
          setDetailsModalIsOpen(false);
          setAddEditModalIsOpen(true);
        }}
        onDeleteClick={handleOpenDeleteModal}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-xl p-6 w-[95%] md:w-full max-w-md border border-gray-700"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-4">Delete Room</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete room #{selectedRoom?.roomID}? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDeleteModalIsOpen(false)}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRoom}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete Room
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomsContainer;