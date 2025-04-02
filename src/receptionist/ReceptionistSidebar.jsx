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
          ease-in-out bg-gray-900 border-r border-gray-800 flex flex-col`}
      >
        <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
          <Building2 className="h-6 w-6 text-amber-400" />
          <div>
            <h1 className="text-lg font-medium text-white">Receptionist</h1>
            <p className="text-xs text-gray-400">
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
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-amber-300'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-amber-300 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
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