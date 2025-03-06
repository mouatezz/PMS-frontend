import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, CheckCircle2, X } from 'lucide-react';
import Sidebar from './SideBar';
import DataTable from './DataTable';
import api from './api';
import { ACCESS_TOKEN } from './constants';
const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [next, setNext] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    staffRole: '',
    shift: '',
    salary: '',
    rooms_responsible: []
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[staff, setStaff] = useState([]);
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'guest': return 'bg-blue-500/20 text-blue-500';
      case 'staff': return 'bg-green-500/20 text-green-500';
      case 'receptionist': return 'bg-purple-500/20 text-purple-500';
      case 'admin': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
      case 'cleaner': return 'bg-blue-500/20 text-blue-500';
      case 'maintenance': return 'bg-green-500/20 text-green-500';
      case 'roomservice': return 'bg-purple-500/20 text-purple-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-500';
      case 'Inactive': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  const removeAttributes = (attributes) => {
    const updatedUser = { ...newUser };
    attributes.forEach(attr => delete updatedUser[attr]);
    setNewUser(updatedUser);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const createUser = async () => {
      try {
        if (newUser.role === 'receptionist') {
          removeAttributes(['staffRole', 'rooms_responsible']);
        } 
        console.log(newUser);
        const response = await api.post('backend/register/',newUser);
        console.log(response.data);
        setUsers([...users, response.data]);
        setShowModal(false);
      } catch (err) {
        console.error('Failed to create user:', err);
        alert('Failed to create user. Please try again.');
      }
    };
    createUser();
  };

  const handleDeleteUser = (username) => {
    const deleteUser = async () => {
      try {
        console.log(username);
        const response = await api.delete(`backend/hotel_admin/deleteusers/${username}/`
        );
        console.log(response.data);
        setUsers(users.filter(user => user.username !== username));
      }  catch (err) {
        console.error(err);
      }
    };
    deleteUser();
  };

  const filteredUsers = users.filter(user => {
    const searchQueryLower = searchQuery.toLowerCase();
    const fullname = user.fullname ? user.fullname.toLowerCase() : '';
    const email = user.email ? user.email.toLowerCase() : '';
    const username = user.username ? user.username.toLowerCase() : '';

    const matchesSearch =
      fullname.includes(searchQueryLower) ||
      email.includes(searchQueryLower) ||
      username.includes(searchQueryLower);

    const matchesRole = filterRole === 'All' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const filteredStaff = staff.filter(staffMember => {
    const searchQueryLower = searchQuery.toLowerCase();
    const fullname = staffMember.fullname ? staffMember.fullname.toLowerCase() : '';
    const staffRole = staffMember.staffRole ? staffMember.staffRole.toLowerCase() : '';

    const matchesSearch =
      fullname.includes(searchQueryLower) ||
      staffRole.includes(searchQueryLower);

    const matchesRole = filterRole === 'All' || staffMember.staffRole === filterRole;

    return matchesSearch && matchesRole;
  });
 /////////////////api/////////////

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('backend/hotel_admin/users/');
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await api.get('backend/hotel_admin/staff/');
        console.log(response.data);
        setStaff(response.data);
        setLoading(false);
      }catch (err) {
        console.error(err);
        setError('Failed to fetch staffs');
        setLoading(false);
      }
   
  };
  fetchUsers();
  fetchStaff();
  }, []);

  const userColumns = [
    {
      key: 'username',
      header: 'username',
      sortable: true,
      cellClassName: 'text-amber-300'
    },
    {
      key: 'fullname',
      header: 'fullName',
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
    },
    {
      key: 'status',
      header: 'Status',
      renderCell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      ),
      
    }
  ];

  const staffColumns =[
    {
      key: 'username',
      header: 'username',
      sortable: true,
      cellClassName: 'text-amber-300'
    },
    {
      key: 'phone',
      header: 'phone Number',
      cellClassName: 'text-amber-300'
    },
    {
      key: 'fullname',
      header: 'fullName',
      cellClassName: 'text-white'
    },
    
    {
      key: 'staffRole',
      header: 'Role',
      renderCell: (staff) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(staff.staffRole)}`}>
          {staff.staffRole}
        </span>
      )
    },
    {
      key: 'shift',
      header: 'Shift',
      cellClassName: 'text-white'
    },
    {
      key: 'status',
      header: 'Status',
      renderCell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(staff.status)}`}>
          {user.status}
        </span>
      )
    },
    {
      key: "rooms_responsible",
      header: "Rooms",
      renderCell: (staff) => staff.rooms_responsible.join(", "), 
      cellClassName: 'text-white'
    }

  ]
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
              className={`py-2 px-4 font-medium ${activeTab === 'All' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('All');
                setFilterRole('All');
              }}
            >
              All
            </button>
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
                setFilterRole('guest');
              }}
            >
              Guests
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'admin' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('admin');
                setFilterRole('admin');
              }}
            >  Admins
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'receptionist' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('receptionist');
                setFilterRole('receptionist');
              }}
            >  Receptionists
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
                      <option value="cleaner">cleaners</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="roomservice">Room Service</option>
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
              columns={activeTab === 'staff' ? staffColumns : userColumns}
              data={activeTab === 'staff' ? filteredStaff : filteredUsers}
              onDelete={handleDeleteUser}
              emptyMessage={`No ${activeTab} found matching your search criteria`}
            />

            <div className="mt-4 text-gray-400 text-sm">
              {activeTab === 'staff' ? (
                <>Showing {filteredStaff.length} of {staff.length} staff members</>
              ) : (
                <>Showing {filteredUsers.length} of {users.length} users</>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Staff Modal */}
      {showModal &&(
        
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

            <form   onSubmit={(e) => {
                       e.preventDefault();
                       if (next) {
                       handleCreateUser(e);
                       setNext(false);
                        } else {
                       setNext(true);
                       }
}}  className="p-4">
              <div className="space-y-4">
                {!next && (
                   <>
                <div>
                <label className="block text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
               </div>
               <div>
                <label className="block text-gray-400 mb-1">password</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
               </div>


               <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
               </div>
               <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={newUser.fullname}
                  onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                />
               </div>
               <div>
                <label className="block text-gray-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
               </div>
              
               </>
               )
              }
              </div>
              <div>
                <div>
                  <label className="block text-gray-400 mb-1">User Role</label>
                  <select
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newUser.role}
                    placeholder="Select Role"
                    onChange={(e) => {
                      setNewUser({ ...newUser, role: e.target.value });
                     
                    }}
                  >
                    <option value="receptionist">receptionist</option>
                    <option value="staff">hotel staff</option>
                  </select>
                </div>
              
                 
 {newUser.role && next && (
  <>
    <div>
      <label className="block text-gray-400 mb-1">Shift</label>
      <select
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
        value={newUser.shift}
        onChange={(e) => setNewUser({ ...newUser, shift: e.target.value })}
      >
        <option value="morning">Morning</option>
        <option value="night">Night</option>
      </select>
    </div>  
    <div>
      <label className="block text-gray-400 mb-1">Salary</label>
      <input
        type="number"
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
        value={newUser.salary}
        onChange={(e) => setNewUser({ ...newUser, salary: e.target.value })}
      />
    </div>
    {newUser.role === 'staff' && (
      <>
        <div>
          <label className="block text-gray-400 mb-1">Staff Role</label>
          <select
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={newUser.staffRole}
            onChange={(e) => setNewUser({ ...newUser, staffRole: e.target.value })}
          >
            <option value="maintenance">Maintenance Worker</option>
            <option value="cleaner">Cleaner</option>
            
            <option value="roomservice">Room Service</option>
          </select>
        </div>
       
          <div>
          <label className="block text-gray-400 mb-1">Rooms Responsible</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={newUser.rooms_responsible.join(" , ")}
            onChange={(e) => setNewUser({ ...newUser, rooms_responsible: e.target.value.split(",").map(room => room.trim()) })}
          />
        </div>
       
      </>
    )}
  </>
)}
</div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false) ;
                    setNext(false)
                   }}
                  className="px-4 py-2 mr-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                 
                  className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span> {next ? 'Create Staff' : 'Next'}</span>
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