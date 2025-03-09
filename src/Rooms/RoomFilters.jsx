import React from 'react';
import { Search } from 'lucide-react';

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'quad', label: 'Quad' },
  { value: 'double', label: 'Double' },
  { value: 'triple', label: 'Triple' }
];

const RoomFilters = ({ searchQuery, setSearchQuery, filterType, setFilterType }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search rooms..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <select
        className="w-full md:w-auto bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All Types</option>
        {ROOM_TYPES.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  );
};

export default RoomFilters;