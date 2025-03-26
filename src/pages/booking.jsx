import React from 'react';
import { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, CheckCircle2, X, Plus } from 'lucide-react';
import Sidebar from '../components/SideBar';
import DataTable from '../components/DataTable';
import api from '../api';

const Booking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newBooking, setNewBooking] = useState({
    room: '',
    NationalID: '',
    guest: '',
    checkInDate: '',
    checkOutDate: '', 
    total_price: ''
  });
  
  const getStatusColor = (status) => {
    switch(status) {
      case true: return 'bg-green-500/20 text-green-500';
      case false: return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const bookingColumns = [
    { 
      key: 'reservationID', 
      header: 'ID', 
      sortable: true,
      cellClassName: 'text-amber-300' 
    },
    { 
      key: 'guest', 
      header: 'username',
      cellClassName: 'text-white' 
    },
    { 
      key: 'NationalID', 
      header: 'GuestID',
      cellClassName: 'text-white' 
    },
    { 
      key: 'room', 
      header: 'Room number',
      cellClassName: 'text-white' 
    },
    { 
      key: 'is_checked_in', 
      header: 'Status',
      renderCell: (booking) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.is_checked_in)}`}>
          {booking.is_checked_in ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: 'total_price', 
      header: 'Amount',
      cellClassName: 'text-white ' 
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const checkIn = new Date(newBooking.checkInDate);
    const checkOut = new Date(newBooking.checkOutDate);
  
    const numberOfNights = !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;
    const bookingData = {
      room: newBooking.room,
      NationalID: newBooking.NationalID,
      guest: newBooking.guest,
      check_in: newBooking.checkInDate,
      check_out: newBooking.checkOutDate,
      num_of_nights:numberOfNights,
      total_price: newBooking.total_price || "0.00"
    };
    
    setNewBooking({
      room: '',
      NationalID: '',
      guest: '',
      checkInDate: '',
      checkOutDate: '',
      total_price: ''
    });
    
    setShowModal(false);
    addBooking(bookingData);
    fetchBookings()
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/backend/hotel_admin/reservations/');
      console.log(response.data);
      setRecentBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const addBooking = async (bookingData) => {
    setLoading(true);
    try {
      
      console.log(bookingData)
      const response = await api.post('/backend/hotel_admin/reservations/' , 
       bookingData
      );
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to create reservation');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex-row">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex-col items-center mb-6">
            <h1 className="text-xl font-medium text-white">Bookings</h1>
            <p className="ml-2 mt-2 font-thin text-gray-400">informations</p>
          </div>
          
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-md transition-colors"
            >
              <Plus size={16} />
              <span>Add New Booking</span>
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-medium">Recent Bookings</h2>
              <a href="#" className="text-amber-300 text-sm">View All</a>
            </div>
            
            <DataTable 
              columns={bookingColumns} 
              data={recentBookings} 
            />
          </div>
        </main>
      </div>
      
      {/* Modal / Popup for adding new booking */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">Add New Booking</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Room Number
                  </label>
                  <input 
                    type="text" 
                    name="room"
                    value={newBooking.room}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Guest ID
                  </label>
                  <input 
                    type="text" 
                    name="NationalID"
                    value={newBooking.NationalID}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Guest Name
                  </label>
                  <input 
                    type="text" 
                    name="guest"
                    value={newBooking.guest}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Check In Date
                  </label>
                  <input 
                    type="date" 
                    name="checkInDate"
                    value={newBooking.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Check Out Date
                  </label>
                  <input 
                    type="date" 
                    name="checkOutDate"
                    value={newBooking.checkOutDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Total Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">$</span>
                    </div>
                    <input 
                      type="number" 
                      name="total_price"
                      value={newBooking.total_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md pl-8 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-300 text-gray-900 rounded-md hover:bg-amber-400"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;