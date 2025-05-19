import React from 'react';
import { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, CheckCircle2, X, Plus } from 'lucide-react';
import Sidebar from '../../components/SideBar';
import DataTable from '../../components/DataTable';
import api from '../../api';

const Booking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 5
  });
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
      num_of_nights: numberOfNights,
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
  };

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/backend/receptionist/reservationPagination/', {
        params: {
          page: page,
          limit: 10
        }
      });
      
      console.log(response.data);
      // Ensure recentBookings is always an array
      setRecentBookings(response.data.data || []);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.pages,
        totalItems: response.data.total,
        limit: 10
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookings(newPage);
    }
  };

  const Pagination = () => {
    const { currentPage, totalPages, totalItems, limit } = pagination;
    const startItem = ((currentPage - 1) * limit) + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    return (
      <div className="flex justify-between items-center mb-20 px-2">
        <span className="text-base text-gray-400">
          Showing {startItem} to {endItem} of {totalItems} reservations
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 font-medium text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex-row">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex-col items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">Bookings</h1>
            <p className="ml-2 mt-2 font-normal text-gray-400">View booking informations</p>
          </div>
          
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-medium">All Bookings</h2>
              {error && <p className="text-red-500">{error}</p>}
              
              
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <DataTable 
                columns={bookingColumns} 
                data={recentBookings} 
              />
            )}
          </div>
          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default Booking;