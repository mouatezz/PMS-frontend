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
  Home,
  UserPlus, 
  Search, 
  Trash2, 
  Filter,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';

const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' or 'guests'
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cleaner'
  });
  
  // Sample staff data
  const [staff, setStaff] = useState([
    { id: 'USR-1001', name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', role: 'Cleaner' },
    { id: 'USR-1002', name: 'Maria Garcia', email: 'maria.g@example.com', phone: '(555) 234-5678', role: 'Maintenance' },
    { id: 'USR-1003', name: 'David Lee', email: 'david.lee@example.com', phone: '(555) 345-6789', role: 'Room Service' },
    { id: 'USR-1004', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(555) 456-7890', role: 'Cleaner' },
    { id: 'USR-1005', name: 'Robert Chen', email: 'robert.c@example.com', phone: '(555) 567-8901', role: 'Maintenance' },
    { id: 'USR-1006', name: 'Emily Wong', email: 'emily.w@example.com', phone: '(555) 678-9012', role: 'Room Service' },
  ]);
  
  // Sample guests data
  const [guests, setGuests] = useState([
    { id: 'GST-1001', name: 'Alex Johnson', email: 'alex.j@example.com', phone: '(555) 111-2222', bookings: 3, status: 'Active' },
    { id: 'GST-1002', name: 'Sophia Williams', email: 'sophia.w@example.com', phone: '(555) 222-3333', bookings: 1, status: 'Active' },
    { id: 'GST-1003', name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 333-4444', bookings: 5, status: 'Active' },
    { id: 'GST-1004', name: 'Emma Davis', email: 'emma.d@example.com', phone: '(555) 444-5555', bookings: 0, status: 'Inactive' },
    { id: 'GST-1005', name: 'James Wilson', email: 'james.w@example.com', phone: '(555) 555-6666', bookings: 2, status: 'Active' },
    { id: 'GST-1006', name: 'Olivia Martinez', email: 'olivia.m@example.com', phone: '(555) 666-7777', bookings: 4, status: 'Active' },
    { id: 'GST-1007', name: 'William Taylor', email: 'william.t@example.com', phone: '(555) 777-8888', bookings: 0, status: 'Inactive' },
    { id: 'GST-1008', name: 'Ava Anderson', email: 'ava.a@example.com', phone: '(555) 888-9999', bookings: 1, status: 'Active' },
  ]);
  
  const getRoleColor = (role) => {
    switch(role) {
      case 'Cleaner': return 'bg-blue-500/20 text-blue-500';
      case 'Maintenance': return 'bg-amber-300/20 text-amber-300';
      case 'Room Service': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-500/20 text-green-500';
      case 'Inactive': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const handleCreateUser = (e) => {
    e.preventDefault();
    
    // Generate a new ID
    const newId = `USR-${1000 + staff.length + 1}`;
    
    // Add new user to list
    setStaff([...staff, { 
      id: newId, 
      ...newUser 
    }]);
    
    // Reset form and close modal
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'Cleaner'
    });
    setShowModal(false);
  };
  
  const handleDeleteUser = (userId) => {
    if (activeTab === 'staff') {
      setStaff(staff.filter(user => user.id !== userId));
    } else {
      setGuests(guests.filter(guest => guest.id !== userId));
    }
  };
  
  // Filter users based on search query and role filter
  const filteredStaff = staff.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  // Filter guests based on search query and status filter
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterRole === 'All' || guest.status === filterRole;
    
    return matchesSearch && matchesStatus;
  });
  
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
          <a href="/dashboard" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md">
            <Calendar className="h-5 w-5 mr-3" />
            <span>Bookings</span>
          </a>
          <a href="/users" className="flex items-center px-3 py-2 text-amber-300 bg-gray-800/50 rounded-md">
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-white">User Management</h1>
            {activeTab === 'staff' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                <span>Add Staff</span>
              </button>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'staff' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('staff');
                setFilterRole('All');
              }}
            >
              Staff
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'guests' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('guests');
                setFilterRole('All');
              }}
            >
              Guests
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-md p-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'staff' ? "Search staff by name, email or ID..." : "Search guests by name, email or ID..."}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  {activeTab === 'staff' ? (
                    <>
                      <option value="All">All Roles</option>
                      <option value="Cleaner">Cleaners</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Room Service">Room Service</option>
                    </>
                  ) : (
                    <>
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </>
                  )}
                </select>
                <Filter className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {activeTab === 'staff' ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-2 font-medium text-gray-400 flex items-center">
                        ID 
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </th>
                      <th className="pb-2 font-medium text-gray-400">Name</th>
                      <th className="pb-2 font-medium text-gray-400">Email</th>
                      <th className="pb-2 font-medium text-gray-400">Phone</th>
                      <th className="pb-2 font-medium text-gray-400">Role</th>
                      <th className="pb-2 font-medium text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((user, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 text-amber-300">{user.id}</td>
                        <td className="py-3 text-white">{user.name}</td>
                        <td className="py-3 text-gray-300">{user.email}</td>
                        <td className="py-3 text-gray-300">{user.phone}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-white text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-red-400 hover:text-red-500 hover:bg-gray-700 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredStaff.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-4 text-center text-gray-400">
                          No staff members found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-2 font-medium text-gray-400 flex items-center">
                        ID 
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </th>
                      <th className="pb-2 font-medium text-gray-400">Name</th>
                      <th className="pb-2 font-medium text-gray-400">Email</th>
                      <th className="pb-2 font-medium text-gray-400">Phone</th>
                      <th className="pb-2 font-medium text-gray-400">Bookings</th>
                      <th className="pb-2 font-medium text-gray-400">Status</th>
                      <th className="pb-2 font-medium text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 text-amber-300">{guest.id}</td>
                        <td className="py-3 text-white">{guest.name}</td>
                        <td className="py-3 text-gray-300">{guest.email}</td>
                        <td className="py-3 text-gray-300">{guest.phone}</td>
                        <td className="py-3 text-gray-300">{guest.bookings}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(guest.status)}`}>
                            {guest.status}
                          </span>
                        </td>
                        <td className="py-3 text-white text-right">
                          <button 
                            onClick={() => handleDeleteUser(guest.id)}
                            className="p-1 text-red-400 hover:text-red-500 hover:bg-gray-700 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-4 text-center text-gray-400">
                          No guests found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="mt-4 text-gray-400 text-sm">
              {activeTab === 'staff' ? (
                <>Showing {filteredStaff.length} of {staff.length} staff members</>
              ) : (
                <>Showing {filteredGuests.length} of {guests.length} guests</>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-md max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Add New Staff Member</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Role</label>
                  <select
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Cleaner">Cleaner</option>
                    <option value="Maintenance">Maintenance Worker</option>
                    <option value="Room Service">Room Service</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 mr-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Create Staff</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;