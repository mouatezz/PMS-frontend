import React, { useState , useEffect } from 'react';
import Sidebar from '../../components/SideBar.jsx';
import DataTable from '../../components/DataTable.jsx';
import { 
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar 
} from 'react-icons/hi2';
import UserRolesChart from './UserRolesChart.jsx';
import Stat from './Stat.jsx';
import SalesChart from './SalesChart.jsx';
import api from '../../api.js';
import { format } from 'date-fns';


const users = [
  { id: 1, name: "John Doe", role: "admin" },
  { id: 2, name: "Jane Smith", role: "staff" },
];




const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users , setusers] =useState([]);
 


const [bookings, setTotalBookings] = useState(0);
const [amount, setTotalAmount] = useState(0);
const [occupency, setOccupancyRate] = useState(0);
const [checkins, setTotalCheckins] = useState(0);
 
 

  const getStatusColor = (status) => {
    switch(status) {
      case true: return 'bg-green-500/20 text-green-500';
      case false: return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };


////////////api call /////////////

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/reservations/');
      console.log(response.data);
      setRecentBookings(response.data);
      const amount = response.data.reduce((acc, reservation) => acc + parseFloat(reservation.total_price), 0);
      const checkins = response.data.filter(reservation => reservation.is_checked_in).length;
      const bookings = response.data.length;
      const occupency = (checkins / bookings) ;
      setTotalBookings(bookings);
      setTotalAmount(amount);
      setTotalCheckins(checkins);
      setOccupancyRate(occupency);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };



    const  fetchusers = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/users/');
      console.log(response.data);
      setusers(response.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }
  fetchusers();
  fetchBookings();
}, []);
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
      cellClassName: 'text-white' 
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
              value={bookings}
              color="blue"
              icon={<HiOutlineBriefcase />}
            />
            <Stat
              title={'Incomes'}
              value={ `${amount} DA`}
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
              value={`${Math.round(occupency * 100)}%`}
              color="amber"
              icon={<HiOutlineChartBar />}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-6">
            <div className="bg-gray-800 rounded-md p-4 col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Recent Bookings</h2>
                <a href="/bookings" className="text-amber-300 text-sm">View All</a>
              </div>
              
              <DataTable 
                columns={bookingColumns} 
                data={recentBookings} 
                onDelete={false}
              />
            </div>
            <div className="col-span-2">
              <UserRolesChart users={users} /> </div>
          </div>
          <div className='pt-3'>  <SalesChart bookings={recentBookings} numDays={30} />   </div>
    

        </main>
      </div>
    </div>
  );
};

export default Dashboard;