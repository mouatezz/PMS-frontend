import React, { useState } from 'react';
import ReceptionistSidebar from './ReceptionistSideBar';
import { 
  Users, 
  BedDouble, 
  Calendar, 
  ClipboardCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sample data based on your models
  const stats = [
    { title: 'Active Reservations', value: 18, icon: Calendar, change: 12, up: true },
    { title: 'Occupied Rooms', value: 24, icon: BedDouble, change: 5, up: true },
    { title: 'Check-ins Today', value: 7, icon: ClipboardCheck, change: 0, up: false },
    { title: 'Check-outs Today', value: 5, icon: Users, change: 2, up: false }
  ];
  
  // Recent activities that align with the Reservation model
  const recentActivities = [
    { id: 'RES-1001', guest: 'John Doe', action: 'Checked In', room: '301', time: '10:30 AM', date: '2024-03-19' },
    { id: 'RES-1002', guest: 'Mary Smith', action: 'Checked Out', room: '205', time: '11:45 AM', date: '2024-03-19' },
    { id: 'RES-1003', guest: 'Robert Johnson', action: 'Reserved', room: '402', time: '09:15 AM', date: '2024-03-19' },
    { id: 'RES-1004', guest: 'Emily Wilson', action: 'Payment', room: '118', time: '02:20 PM', date: '2024-03-19' }
  ];
  
  // Upcoming check-ins based on Reservation model
  const upcomingCheckIns = [
    { id: 'RES-2001', guest: 'David Miller', nationalID: 'ID12345678', check_in: '2024-03-19', num_of_nights: 3, room: '402', is_checked_in: false },
    { id: 'RES-2002', guest: 'Susan Clark', nationalID: 'ID87654321', check_in: '2024-03-19', num_of_nights: 1, room: '215', is_checked_in: false },
    { id: 'RES-2003', guest: 'Michael Brown', nationalID: 'ID98765432', check_in: '2024-03-20', num_of_nights: 5, room: '103', is_checked_in: false }
  ];
  
  // Upcoming check-outs based on Reservation model
  const upcomingCheckOuts = [
    { id: 'RES-1893', guest: 'James Wilson', check_out: '2024-03-19', room: '118', is_checked_in: true, is_checked_out: false },
    { id: 'RES-1902', guest: 'Patricia Moore', check_out: '2024-03-19', room: '225', is_checked_in: true, is_checked_out: false },
    { id: 'RES-1920', guest: 'Thomas Lee', check_out: '2024-03-20', room: '310', is_checked_in: true, is_checked_out: false }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className="bg-gray-800 shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-white">Receptionist Dashboard</h1>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                R
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-amber-400/20 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.up ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-amber-400 mr-1" />
                  )}
                  <span className={`text-sm ${stat.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {stat.change}% from yesterday
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activities</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentActivities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-300">{activity.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{activity.guest}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{activity.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{activity.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a href="/check-in" className="block bg-amber-400/10 hover:bg-amber-400/20 transition-colors text-amber-300 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ClipboardCheck className="h-6 w-6 mr-3" />
                    <span className="font-medium">Process Check-in</span>
                  </div>
                </a>
                <a href="/check-out" className="block bg-amber-400/10 hover:bg-amber-400/20 transition-colors text-amber-300 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    <span className="font-medium">Process Check-out</span>
                  </div>
                </a>
                <a href="/reservations" className="block bg-amber-400/10 hover:bg-amber-400/20 transition-colors text-amber-300 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3" />
                    <span className="font-medium">Manage Reservations</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Check-ins */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Today's Check-ins</h2>
              {upcomingCheckIns.map((checkin, index) => (
                <div key={index} className="flex flex-col mb-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-white font-medium">{checkin.guest}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-400">Room {checkin.room}</span>
                      <span className="text-xs text-gray-400">{checkin.num_of_nights} nights</span>
                      <span className="text-xs text-gray-400">ID: {checkin.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upcoming Check-outs */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Today's Check-outs</h2>
              {upcomingCheckOuts.map((checkout, index) => (
                <div key={index} className="flex flex-col mb-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-white font-medium">{checkout.guest}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-400">Room {checkout.room}</span>
                      <span className="text-xs text-gray-400">ID: {checkout.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;