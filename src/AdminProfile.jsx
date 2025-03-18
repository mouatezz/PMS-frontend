import React, { useState  , useEffect} from 'react';
import Sidebar from './SideBar';
import api from './api.js'
import { 
  CheckCircle2,
  X,
  Camera,
  Pencil,
  User
} from 'lucide-react';

const AdminProfile = () => {
  const  defaultimage = '/src/assets/images/defaultUser.png'

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    username: 'loading...',
    role: "loading...",
    fullname : "loading...",
    email: 'loading...@example.com',
    phone: 'loading...',
    image: '/src/assets/images/defaultUser.png' 
  });
  const [editMode, setEditMode] = useState(false);
  const [newimage, setnewimage] = useState(null);
const [backimage , setbackimage]= useState(null)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  formData.append("image", backimage); 
  formData.append("name", adminInfo.name);
  formData.append("email", adminInfo.email);
  formData.append("fullname", adminInfo.fullname);

    try {

      const username = localStorage.getItem('username');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await api.put(`/backend/hotel_admin/deleteusers/${username}/` ,  formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      console.log(response.data);
      setEditMode(false)
    } catch (err) {
      console.error(err);
      setEditMode(false)
    }
  };

  const getuserinfos = async (username) => {
    try {
      console.log(username)
      const response = await api.get(`/backend/hotel_admin/deleteusers/${username}/`);
      console.log(response.data);
      setAdminInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() =>{
     let user =localStorage.getItem('username')
     getuserinfos(user)
  }, []);

  const handleimageUpload = (e) => { 
    const file = e.target.files[0];
    if (file) {
      setbackimage(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setnewimage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 md:ml-64 p-6">
        <main className="h-screen flex flex-col">
          <div className="flex-1 bg-gray-900 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-amber-500 to-amber-300 relative">
                  <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-700 flex items-center justify-center">
                        {newimage || adminInfo.image ? (
                          <img
                          src={newimage || `http://127.0.0.1:8000${adminInfo.image}` } 
                            alt="Profile"
                            className="w-full h-full object-cover"
                           
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-500" />
                        )}
                      </div>
                      {editMode && (
                        <label
                          htmlFor="profile-pic-upload"
                          className="absolute bottom-0 right-0 bg-amber-300 rounded-full p-2 cursor-pointer shadow-lg hover:bg-amber-400 transition-all"
                        >
                          <Camera className="h-5 w-5 text-gray-900" />
                        </label>
                      )}
                      <input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleimageUpload}
                      />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-all"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditMode(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-1">{adminInfo.username}</h2>
                    <div className="text-amber-300 text-lg font-medium mb-4">{adminInfo.role}</div>
                    <div className=" gap-6">

                      
                      <div className="flex items-center text-gray-300 pb-3">
                        
                        <div className="w-24 text-gray-500">name</div>
                        <div className="text-lg">{adminInfo.fullname}</div>
                      </div>
                      <div className="flex items-center text-gray-300 pb-3">
                        <div className="w-24 text-gray-500">Email</div>
                        <div className="text-lg">{adminInfo.email}</div>
                      </div>
                      <div className="flex items-center text-gray-300 pb-3">
                        <div className="w-24 text-gray-500">Phone</div>
                        <div className="text-lg">{adminInfo.phone}</div>
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <form onSubmit={handleUpdateProfile} className="space-y-6 mt-8 border-t border-gray-700 pt-8">
                      <h3 className="text-xl font-semibold text-white mb-4">Edit Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                            value={adminInfo.fullname}
                            onChange={(e) =>
                              setAdminInfo({ ...adminInfo, fullname: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm font-medium">Email</label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                            value={adminInfo.email}
                            onChange={(e) =>
                              setAdminInfo({ ...adminInfo, email: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm font-medium">Phone Number</label>
                          <input
                            type="tel"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                            value={adminInfo.phone}
                            onChange={(e) =>
                              setAdminInfo({ ...adminInfo, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-6 py-3 mr-4 text-gray-300 hover:text-white rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-3 px-6 rounded-md flex items-center transition-all"
                        >
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;