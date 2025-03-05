import React, { useState , useEffect } from 'react';
import Sidebar from './SideBar';
import DataTable from './DataTable';
import api from './api'
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
 
  const [stats, setStats] = useState([
    { title: 'Bookings', value: '0' },
    { title: 'Occupancy', value: '0' },
    { title: 'Revenue', value: '0' },
    { title: 'Guests', value: '0' }
  ]);
  const [roomstats, setRoomStats] = useState([
    { title: 'Occupied', value: '0' },
    { title: 'Available', value: '0' },
  ]);
 

  const getStatusColor = (status) => {
    switch(status) {
      case true: return 'bg-green-500/20 text-green-500';
      case false: return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };


////////////api call ///////////////

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/reservations/');
      console.log(response.data);
      setRecentBookings(response.data);
      const revenue = response.data.reduce((acc, reservation) => acc + parseFloat(reservation.total_price), 0);
      setStats(stats => stats.map(stat => stat.title === 'Revenue' ? { ...stat, value: revenue } : stat));
      setStats(stats => stats.map(stat => stat.title === 'Bookings' ? { ...stat, value: response.data.length } : stat));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const fetchrooms = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/rooms/');
      console.log(response.data);
      const totalRooms = response.data.length;
      const occupiedRooms = response.data.filter(room => room.is_occupied === 'true').length;
      const availableRooms = totalRooms - occupiedRooms;
      setRoomStats([
        { title: 'Occupied', value: occupiedRooms },
        { title: 'Available', value: availableRooms },
      ]);
      const occupency = (occupiedRooms / totalRooms) * 100;
      setStats(stats => stats.map(stat => stat.title === 'Occupancy' ? { ...stat, value: occupency } : stat));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch rooms');
      setLoading(false);
    }
  }

    const  fetchguests = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/guests/');
      console.log(response.data);
      const totalGuests = response.data.length;
      setStats(stats => stats.map(stat => stat.title === 'Guests' ? { ...stat, value: totalGuests } : stat));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch guests');
      setLoading(false);
    }
  }
  fetchrooms();
  fetchguests();
  fetchBookings();
}, []);

  const bookingColumns = [
    { 
      key: 'reservationID', 
      header: 'ID', 
      sortable: true,
      cellClassName: 'text-amber-300' 
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <h1 className="text-xl font-medium text-white mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-md p-4">
                <p className="text-amber-300 text-sm">{stat.title}</p>
                <h3 className="text-white text-xl font-medium">{stat.value}</h3>
              </div>
            ))}
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
          
          <div className="bg-gray-800 rounded-md p-4">
            <h2 className="text-white font-medium mb-4">Room Status</h2>
            
            
            <div className="flex space-x-6 mb-4">
              {roomstats.map ((roomstat, index) => (
                <div key={index}>
                  <div className="text-xl font-medium text-white">{roomstat.value}</div>
                  <div className="text-amber-300 text-sm">{roomstat.title}</div>
                </div>
              ))}
              
            </div>

            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="bg-green-500 h-full" style={{width: '33%'}}></div>
                <div className="bg-amber-300 h-full" style={{width: '59%'}}></div>
                <div className="bg-red-500 h-full" style={{width: '8%'}}></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;