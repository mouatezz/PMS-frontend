import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleAddReservation }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Reservations</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by guest name, room ID or ID number..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <button 
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={handleAddReservation}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Reservation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;