import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import HotelInfoComponent from '../../components/HotelInfoComponent';
import FacilitiesComponent from '../../components/FacilitiesComponent';
import MenuItemsComponent from '../../components/MenuItemsComponent';
import { 
  Info,
  Hotel,
  Utensils
} from 'lucide-react';

const HotelManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hotel-info');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">Hotel Management</h1>
          </div>
          
          {/* Tabs Navigation */}
          <div className="mb-6 border-b border-gray-700">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('hotel-info')}
                className={`pb-4 px-2 font-medium ${
                  activeTab === 'hotel-info' 
                    ? 'border-b-2 border-amber-300 text-amber-300' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  <span>Hotel Information</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('facilities')}
                className={`pb-4 px-2 font-medium ${
                  activeTab === 'facilities' 
                    ? 'border-b-2 border-amber-300 text-amber-300' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Hotel className="h-5 w-5 mr-2" />
                  <span>Facilities</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`pb-4 px-2 font-medium ${
                  activeTab === 'menu' 
                    ? 'border-b-2 border-amber-300 text-amber-300' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 mr-2" />
                  <span>Menu</span>
                </div>
              </button>
            </nav>
          </div>
          
          {/* Content based on active tab */}
          <div className="mt-6">
            {activeTab === 'hotel-info' && <HotelInfoComponent />}
            {activeTab === 'facilities' && <FacilitiesComponent />}
            {activeTab === 'menu' && <MenuItemsComponent />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HotelManagement;
