import React from 'react';
import { 
  Building2, 
  Home,
  Calendar, 
  Users, 
  BedDouble, // Rooms icon
  UserCircle, // Admin Profile icon
  LogOut,
  PartyPopper, // Events and Activities icon
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard' 
    },
    { 
      icon: BedDouble, 
      label: 'Rooms', 
      href: '/rooms' 
    },
    { 
      icon: PartyPopper, 
      label: 'Events and Activities', 
      href: '/events-activities' 
    },
    { 
      icon: Users, 
      label: 'Users', 
      href: '/users' 
    },
    { 
      icon: UserCircle, 
      label: 'Admin Profile', 
      href: '/admin-profile' 
    }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 
        ease-in-out bg-gray-900 border-r border-gray-800 flex flex-col`}
    >
      <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
        <Building2 className="h-6 w-6 text-amber-300" />
        <div>
          <h1 className="text-lg font-medium text-white">Admin</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = window.location.pathname === item.href;
          return (
            <a 
              key={index} 
              href={item.href} 
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'text-amber-300 bg-gray-800/50' 
                  : 'text-gray-400 hover:text-amber-300'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <a 
          href="#" 
          className="flex items-center px-3 py-2 text-gray-400 hover:text-amber-300 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;