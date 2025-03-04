import React, { useState } from 'react';
import Sidebar from './SideBar';
import DataTable from './DataTable';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const stats = [
    { title: 'Bookings', value: '1,284' },
    { title: 'Occupancy', value: '78%' },
    { title: 'Revenue', value: '$42,389' },
    { title: 'Guests', value: '324' }
  ];
  
  const recentBookings = [
    { id: 'BK-7829', guest: 'Emma Thompson', status: 'Confirmed', amount: '$890' },
    { id: 'BK-7830', guest: 'Michael Chen', status: 'Pending', amount: '$420' },
    { id: 'BK-7831', guest: 'Sarah Johnson', status: 'Confirmed', amount: '$2,450' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-500';
      case 'Pending': return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const bookingColumns = [
    { 
      key: 'id', 
      header: 'ID', 
      sortable: true,
      cellClassName: 'text-amber-300' 
    },
    { 
      key: 'guest', 
      header: 'Guest',
      cellClassName: 'text-white' 
    },
    { 
      key: 'status', 
      header: 'Status',
      renderCell: (booking) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      )
    },
    { 
      key: 'amount', 
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
              <div>
                <div className="text-xl font-medium text-white">24</div>
                <div className="text-amber-300 text-sm">Available</div>
              </div>
              <div>
                <div className="text-xl font-medium text-white">42</div>
                <div className="text-amber-300 text-sm">Occupied</div>
              </div>
              <div>
                <div className="text-xl font-medium text-white">6</div>
                <div className="text-amber-300 text-sm">Maintenance</div>
              </div>
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