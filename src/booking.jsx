import React from 'react';
import  { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, CheckCircle2, X } from 'lucide-react';
import Sidebar from './SideBar';
import DataTable from './DataTable';
import api from './api'
const Booking = () => {
    
  const getStatusColor = (status) => {
    switch(status) {
      case true: return 'bg-green-500/20 text-green-500';
      case false: return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

     const [sidebarOpen, setSidebarOpen] = useState(false);
      const [recentBookings, setRecentBookings] = useState([]);
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
          cellClassName: 'text-white text-right' 
        }
      ];

      useEffect(() => {
        const fetchBookings = async () => {
          try {
            const response = await api.get('/backend/hotel_admin/reservations/');
            console.log(response.data);
            setRecentBookings(response.data);
           } catch (err) {
            console.error(err);
            setError('Failed to fetch bookings');
            setLoading(false);
          }
    };
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
                <p className="ml-2 mt-2 font-thin` text-gray-400"> informations</p>
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
        
         </div>
    );
};

export default Booking;