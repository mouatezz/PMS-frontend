import React, { useState } from 'react';
import Sidebar from '../SideBar.jsx';
import DataTable from '../DataTable.jsx';
import { 
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar 
} from 'react-icons/hi2';
import UserRolesChart from './UserRolesChart';
import Stat from './Stat';
import SalesChart from './SalesChart.jsx';

const users = [
  { id: 1, name: "John Doe", role: "admin" },
  { id: 2, name: "Jane Smith", role: "staff" },
  { id: 3, name: "Bob Johnson", role: "receptionist" },
  { id: 4, name: "Alice Williams", role: "guest" },
  { id: 5, name: "Charlie Brown", role: "admin" },
  { id: 6, name: "David Miller", role: "staff" },
  { id: 7, name: "Eve Wilson", role: "receptionist" },
  { id: 8, name: "Frank Thomas", role: "guest" }
];

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Simulated static data for testing
  const numBookings = 19;
  const sales = 64635;
  const checkins = 13;
  const ocupation = 0.10; // 10% occupancy

  const bookings = [
    
      {
        "id": "BOOK-001",
        "created_at": "2024-03-20T10:30:00Z",
        "totalPrice": 345,
        "extrasPrice": 45
      },
      {
        "id": "BOOK-002", 
        "created_at": "2024-03-20T14:15:00Z",
        "totalPrice": 520,
        "extrasPrice": 75
      },
      {
        "id": "BOOK-003",
        "created_at": "2024-03-21T09:45:00Z", 
        "totalPrice": 210,
        "extrasPrice": 30
      },
      {
        "id": "BOOK-004",
        "created_at": "2024-03-21T16:20:00Z",
        "totalPrice": 435,
        "extrasPrice": 60
      },
      {
        "id": "BOOK-005",
        "created_at": "2024-03-22T11:10:00Z",
        "totalPrice": 280,
        "extrasPrice": 40
      },
      {
        "id": "BOOK-006",
        "created_at": "2024-03-22T15:35:00Z", 
        "totalPrice": 495,
        "extrasPrice": 85
      },
      {
        "id": "BOOK-007",
        "created_at": "2024-03-23T13:25:00Z",
        "totalPrice": 375,
        "extrasPrice": 55
      }
    
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
      
      <div className="flex-1 p-6 md:ml-64">
        <main className="p-6">
          <h1 className="text-3xl font-medium text-white mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-4 gap-6 mb-6">
            <Stat
              title={'Bookings'}
              value={numBookings}
              color="blue"
              icon={<HiOutlineBriefcase />}
            />
            <Stat
              title={'Sales'}
              value={formatCurrency(sales)}
              color="green"
              icon={<HiOutlineBanknotes />}
            />
            <Stat
              title={'Check ins'}
              value={checkins}
              color="purple"
              icon={<HiOutlineCalendarDays />}
            />
            <Stat
              title={'Occupancy rate'}
              value={`${Math.round(ocupation * 100)}%`}
              color="amber"
              icon={<HiOutlineChartBar />}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-6">
            <div className="bg-gray-800 rounded-md p-4 col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Recent Bookings</h2>
                <a href="#" className="text-amber-300 text-sm">View All</a>
              </div>
              
              <DataTable 
                columns={bookingColumns} 
                data={recentBookings} 
              />
            </div>
            <div className="col-span-2">
              <UserRolesChart users={users} /> </div>
          </div>
          <div className='pt-3'>  <SalesChart bookings={bookings} numDays={30} />   </div>
    

        </main>
      </div>
    </div>
  );
};

export default Dashboard;