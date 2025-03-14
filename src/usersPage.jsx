import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import Sidebar from './SideBar';
import DataTable from './DataTable';

const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState('staff');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cleaner'
  });
  
  const [staff, setStaff] = useState([
    { id: 'USR-1001', name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', role: 'Cleaner' },
    { id: 'USR-1002', name: 'Maria Garcia', email: 'maria.g@example.com', phone: '(555) 234-5678', role: 'Maintenance' },
  ]);
  
  const [guests, setGuests] = useState([
    { id: 'GST-1001', name: 'Alex Johnson', email: 'alex.j@example.com', phone: '(555) 111-2222', bookings: 3, status: 'Active' },
    { id: 'GST-1002', name: 'Sophia Williams', email: 'sophia.w@example.com', phone: '(555) 222-3333', bookings: 1, status: 'Active' },
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
    
    const newId = `USR-${1000 + staff.length + 1}`;
    
    setStaff([...staff, { 
      id: newId, 
      ...newUser 
    }]);
    
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
  
  const filteredStaff = staff.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterRole === 'All' || guest.status === filterRole;
    
    return matchesSearch && matchesStatus;
  });

const staffColumns = [
  { 
    key: 'id', 
    header: 'ID', 
    sortable: true,
    cellClassName: 'text-amber-300' 
  },
  { 
    key: 'name', 
    header: 'Name',
    cellClassName: 'text-white' 
  },
  { 
    key: 'email', 
    header: 'Email',
    cellClassName: 'text-gray-300' 
  },
  { 
    key: 'phone', 
    header: 'Phone',
    cellClassName: 'text-gray-300' 
  },
  { 
    key: 'role', 
    header: 'Role',
    renderCell: (user) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
        {user.role}
      </span>
    )
  }
];

const guestColumns = [
  { 
    key: 'id', 
    header: 'ID', 
    sortable: true,
    cellClassName: 'text-amber-300' 
  },
  { 
    key: 'name', 
    header: 'Name',
    cellClassName: 'text-white' 
  },
  { 
    key: 'email', 
    header: 'Email',
    cellClassName: 'text-gray-300' 
  },
  { 
    key: 'phone', 
    header: 'Phone',
    cellClassName: 'text-gray-300' 
  },
  { 
    key: 'bookings', 
    header: 'Bookings',
    cellClassName: 'text-gray-300' 
  },
  { 
    key: 'status', 
    header: 'Status',
    renderCell: (guest) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(guest.status)}`}>
        {guest.status}
      </span>
    )
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
          
          <DataTable 
            columns={activeTab === 'staff' ? staffColumns : guestColumns} 
            data={activeTab === 'staff' ? filteredStaff : filteredGuests}
            onDelete={handleDeleteUser}
            emptyMessage={`No ${activeTab} found matching your search criteria`}
          />
          
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