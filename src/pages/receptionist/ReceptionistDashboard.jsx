import React, { useState, useEffect } from 'react';
import ReceptionistSidebar from './ReceptionistSideBar';
import { 
  Users, 
  BedDouble, 
  Calendar, 
  ClipboardCheck,
  CreditCard,
  UserPen,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import api from '../../api';
const ReceptionistDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [upcomingCheckIns, setUpcomingCheckIns] = useState([]);
  const [upcomingCheckOuts, setUpcomingCheckOuts] = useState([]);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  let data=[];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };



  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const [stats, setStats] = useState([]);

  
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/backend/hotel_admin/reservations/');
        console.log(response.data);
        setReservations(response.data);
        data= response.data;

        const checkIns = data
          .filter(r => isToday(r.check_in) && !r.is_checked_in && !r.is_cancelled)
          .slice(0, 4);
        setUpcomingCheckIns(checkIns);
        
        const checkOuts = data
          .filter(r => isToday(r.check_out) && r.is_checked_in && !r.is_checked_out && !r.is_cancelled)
          .slice(0, 4); 
        setUpcomingCheckOuts(checkOuts);
        
        const current = data
          .filter(r => r.is_checked_in && !r.is_checked_out)
          .map(r => ({
            id: `RES-${r.reservationID}`,
            guest: r.guest,
            action: 'Checked In',
            room: r.room,
            check_out : r.check_out,
            date: formatDate(r.check_in)
          }));
        setCurrentReservations(current);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
      const getYesterday = (dateString) => {
        const date = new Date(dateString);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (
          date.getDate() === yesterday.getDate() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getFullYear() === yesterday.getFullYear()
        );
      };
      
      const calcChange = (todayCount, yesterdayCount) => {
        if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
        return Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
      };
      
      // Compute today's and yesterday's values
      const todayReservations = data.filter(r => !r.is_cancelled);
      const yesterdayReservations = data.filter(r => !r.is_cancelled);
      
      const todayCheckins = todayReservations.filter(r => isToday(r.check_in));
      const yesterdayCheckins = yesterdayReservations.filter(r => getYesterday(r.check_in));
      
      const todayCheckouts = todayReservations.filter(r => isToday(r.check_out));
      const yesterdayCheckouts = yesterdayReservations.filter(r => getYesterday(r.check_out));
      
      const todayOccupied = todayReservations.filter(r => r.is_checked_in && !r.is_checked_out);
      const yesterdayOccupied = yesterdayReservations.filter(r => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return (
          new Date(r.check_in) <= d &&
          (!r.is_checked_out || new Date(r.check_out) > d)
        );
      });
      
      // Final calculated stats
      setStats([
        {
          title: 'Reservations',
          value: todayReservations.length,
          icon: Calendar,
          change: calcChange(todayReservations.length, yesterdayReservations.length),
          up: todayReservations.length >= yesterdayReservations.length,
        },
        {
          title: 'Occupied Rooms',
          value: todayOccupied.length,
          icon: BedDouble,
          change: calcChange(todayOccupied.length, yesterdayOccupied.length),
          up: todayOccupied.length >= yesterdayOccupied.length,
        },
        {
          title: 'Check-ins Today',
          value: todayCheckins.length,
          icon: ClipboardCheck,
          change: calcChange(todayCheckins.length, yesterdayCheckins.length),
          up: todayCheckins.length >= yesterdayCheckins.length,
        },
        {
          title: 'Check-outs Today',
          value: todayCheckouts.length,
          icon: Users,
          change: calcChange(todayCheckouts.length, yesterdayCheckouts.length),
          up: todayCheckouts.length >= yesterdayCheckouts.length,
        },
      ]);

    };
    
    fetchReservations();

    
    
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Receptionist Dashboard</h1>
           
          </div>
        </header>
        
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.up ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-amber-600 mr-1" />
                  )}
                  <span className={`text-sm ${stat.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {stat.change}% from yesterday
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Current Guests</h2>
                <a href="/receptionist/reservations" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  See all <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentReservations.length > 0 ? (
                      currentReservations.map((activity, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">{activity.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{activity.guest}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{activity.room}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.check_out}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No current guests
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a href="/receptionist/walkincheckin" className="block bg-amber-50 hover:bg-amber-100 transition-colors text-amber-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <UserPen className="h-6 w-6 mr-3"/>
                    <span className="font-medium">Create walk-in Check-in</span>
                  </div>
                </a>
                <a href="/receptionist/checkin" className="block bg-amber-50 hover:bg-amber-100 transition-colors text-amber-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ClipboardCheck className="h-6 w-6 mr-3" />
                    <span className="font-medium">Process Check-in</span>
                  </div>
                </a>
                <a href="/receptionist/checkout" className="block bg-amber-50 hover:bg-amber-100 transition-colors text-amber-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    <span className="font-medium">Process Check-out</span>
                  </div>
                </a>
                <a href="/receptionist/bookings" className="block bg-amber-50 hover:bg-amber-100 transition-colors text-amber-700 p-4 rounded-lg">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Today's Check-ins</h2>
                <a href="/receptionist/checkin" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  See all <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              {upcomingCheckIns.length > 0 ? (
                upcomingCheckIns.map((checkin, index) => (
                  <div key={index} className="flex flex-col mb-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-gray-800 font-medium">{checkin.guest}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Room {checkin.room}</span>
                        <span className="text-xs text-gray-500">{checkin.num_of_nights} nights</span>
                        <span className="text-xs text-gray-500">ID: RES-{checkin.reservationID}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No check-ins scheduled for today</div>
              )}
            </div>
            
            {/* Upcoming Check-outs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Today's Check-outs</h2>
                <a href="/receptionist/checkout" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  See all <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              {upcomingCheckOuts.length > 0 ? (
                upcomingCheckOuts.map((checkout, index) => (
                  <div key={index} className="flex flex-col mb-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-gray-800 font-medium">{checkout.guest}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Room {checkout.room}</span>
                        <span className="text-xs text-gray-500">ID: RES-{checkout.reservationID}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No check-outs scheduled for today</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;