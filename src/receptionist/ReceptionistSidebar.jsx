import React from 'react';
import { 
  Building2, 
  Home,
  Calendar,
  ClipboardCheck,
  LogOut,
  DoorOpen,
  Menu,
  X
} from 'lucide-react';

const ReceptionistSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard' 
    },
    { 
      icon: Calendar, 
      label: 'Reservations', 
      href: '/reservations' 
    },
    { 
      icon: DoorOpen, 
      label: 'Check In', 
      href: '/check-in' 
    },
    { 
      icon: ClipboardCheck, 
      label: 'Check Out', 
      href: '/check-out' 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed z-50 bottom-4 right-4 p-3 rounded-full bg-amber-500 text-white shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 
          ease-in-out bg-white border-r border-gray-200 flex flex-col shadow-md`}
      >
        <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
          <Building2 className="h-6 w-6 text-amber-600" />
          <div>
            <h1 className="text-lg font-medium text-gray-800">Receptionist</h1>
            <p className="text-xs text-gray-500">
              {localStorage.getItem('userEmail')}
            </p>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = window.location.pathname === item.href;
            return (
              <a 
                key={index} 
                href={item.href} 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-amber-600 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default ReceptionistSidebar;