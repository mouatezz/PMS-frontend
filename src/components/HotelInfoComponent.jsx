import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { 
  Edit, 
  Upload,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Info,
  Save
} from 'lucide-react';

const HotelInfoComponent = () => {
  // State for hotel information
  const [hotelInfo, setHotelInfo] = useState([{
    hotelId: 1,
    description: 'Luxury hotel with breathtaking views',
    location: '123 Ocean Drive, Beach City',
    phone: 5551234567,
    email: 'contact@luxuryhotel.com',
    instagram: 'luxuryhotel',
    facebook: 'luxuryhotel',
    twitter: 'luxuryhotel',
  }]);
  
  // Form states - separate for this component
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    fetchHotelInfo();
  }, []);
  
  // API call for hotel info
  const fetchHotelInfo = async () => {
    try {

      const response = await api.get('/backend/hotel_admin/hotel/');
      setHotelInfo(response.data);
      console.log('Hotel info fetched:', response.data);
    } catch (err) {
      console.error(err);
    }
  };
  
 
  
  const handleEditHotelInfo = () => {
    // Make a copy of the first hotel info object
    setFormData({...hotelInfo[0]});
    setShowModal(true);
  };
  
  // Fixed input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const updateHotelInfo = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      delete formData.image; // Remove hotelId from formData
      const response = await api.put(`/backend/hotel_admin/hotel/${hotelInfo[0].hotelId}`, formData);
      // Update the array properly:
      setHotelInfo([{...formData}]);
      console.log('Hotel info updated');
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  // Hotel Info Modal
  const HotelInfoModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-white font-medium text-lg">
              Edit Hotel Information
            </h3>
            <button 
              onClick={() => setShowModal(false)} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={updateHotelInfo} className="p-6">
            <div className="space-y-10">
              <div>
                <label htmlFor="description" className="block text-gray-300 mb-2 font-medium">Description</label>
                <textarea 
                  id="description"
                  name="description"
                  required
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Hotel description"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-300 mb-2 font-medium">Location</label>
                <input 
                  type="text" 
                  id="location"
                  name="location"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="Hotel location"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-2 font-medium">Phone</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="contact@yourhotel.com"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-200 font-medium mb-3">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-rows-3 gap-4">
                  <div className="relative">
                    <label htmlFor="instagram" className="block text-gray-300 mb-2 font-medium">Instagram</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 bg-gray-800 border border-r-0 border-gray-600 rounded-l-md text-gray-400">
                        @
                      </span>
                      <input 
                        type="text" 
                        id="instagram"
                        name="instagram"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.instagram || ''}
                        onChange={handleInputChange}
                        placeholder="hotelname"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="facebook" className="block text-gray-300 mb-2 font-medium">Facebook</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 bg-gray-800 border border-r-0 border-gray-600 rounded-l-md text-gray-400">
                        @
                      </span>
                      <input 
                        type="text" 
                        id="facebook"
                        name="facebook"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.facebook || ''}
                        onChange={handleInputChange}
                        placeholder="hotelname"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="twitter" className="block text-gray-300 mb-2 font-medium">Twitter/X</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 bg-gray-800 border border-r-0 border-gray-600 rounded-l-md text-gray-400">
                        @
                      </span>
                      <input 
                        type="text" 
                        id="twitter"
                        name="twitter"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.twitter || ''}
                        onChange={handleInputChange}
                        placeholder="hotelname"
                      />
                    </div>
                  </div>
                </div>
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
                className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                <span>Update</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Render hotel information
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Info className="h-5 w-5 mr-2 text-amber-300" />
          Hotel Information
        </h2>
        <button
          onClick={handleEditHotelInfo}
          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <Edit className="h-5 w-5 mr-2" />
          <span>Edit</span>
        </button>
      </div>
      
      {hotelInfo.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-gray-300 font-medium mb-2">Description</h3>
              <p className="text-gray-400">{hotelInfo[0].description}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-300 font-medium mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-gray-400 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-amber-300" />
                  {hotelInfo[0].phone}
                </p>
                <p className="text-gray-400 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-amber-300" />
                  {hotelInfo[0].email}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-300 font-medium mb-2">Social Media</h3>
              <div className="space-y-2">
                <p className="text-gray-400 flex items-center">
                  <Instagram className="h-4 w-4 mr-2 text-amber-300" />
                  @{hotelInfo[0].instagram}
                </p>
                <p className="text-gray-400 flex items-center">
                  <Facebook className="h-4 w-4 mr-2 text-amber-300" />
                  @{hotelInfo[0].facebook}
                </p>
                <p className="text-gray-400 flex items-center">
                  <Twitter className="h-4 w-4 mr-2 text-amber-300" />
                  @{hotelInfo[0].twitter}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src={`http://localhost:8000${hotelInfo[0].image}`} 
              alt="Hotel" 
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
        </div>
      )}
      
      <HotelInfoModal />
    </div>
  );
};

export default HotelInfoComponent;