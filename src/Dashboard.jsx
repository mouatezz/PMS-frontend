import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Home
} from 'lucide-react';

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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 border-r border-gray-800 flex flex-col`}>
        <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
          <Building2 className="h-6 w-6 text-amber-300" />
          <div>
            <h1 className="text-lg font-medium text-white">Admin</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-amber-300 bg-gray-800/50 rounded-md">
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <Calendar className="h-5 w-5 mr-3" />
            <span>Bookings</span>
          </a>
          <a href="/users" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <Users className="h-5 w-5 mr-3" />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <BarChart3 className="h-5 w-5 mr-3" />
            <span>Reports</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <a href="#" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </a>
        </div>
      </aside>
      
      <div className="flex-1 md:ml-64">
        <header className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden p-2 rounded-md bg-gray-800 text-white"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-md bg-gray-800 text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-300"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center text-gray-900 font-medium">
                A
              </div>
            </div>
          </div>
        </header>
        
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
            
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-2 font-medium text-gray-400">ID</th>
                  <th className="pb-2 font-medium text-gray-400">Guest</th>
                  <th className="pb-2 font-medium text-gray-400">Status</th>
                  <th className="pb-2 font-medium text-gray-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3 text-amber-300">{booking.id}</td>
                    <td className="py-3 text-white">{booking.guest}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 text-white text-right">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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