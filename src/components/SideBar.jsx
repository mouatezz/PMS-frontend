import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Home,
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, PartyPopper,UserCircle,
  BedDouble 
} from 'lucide-react';
import {logout} from "../utils"
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/' 
    },
    { 
      icon: BedDouble, 
      label: 'Rooms', 
      href: '/rooms' 
    },
    { 
      icon: Calendar, 
      label: 'Bookings', 
      href: '/bookings' 
    },
    { 
      icon: Users, 
      label: 'Users', 
      href: '/users' 
    },
    { 
      icon: PartyPopper, 
      label: 'Events and Activities', 
      href: '/events' 
    }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 
        ease-in-out bg-gray-900 border-r border-gray-800 flex flex-col`}
    >
      <Link to='/profile'>
          <div className="p-6 mt-6 flex flex-col items-center space-y-2 border-b border-gray-800">
        <img 
          src={`http://127.0.0.1:8000${localStorage.getItem('image')}` }
          alt="profile pic" 
          className="h-20 w-20 rounded-full object-cover mb-2"
        />
        <span className="text-white font-semibold truncate text-xl">
          {localStorage.getItem('username')}
        </span>
        <span className="text-gray-400 text-sm">
         novotel hotel Admin
        </span>
      </div>
      </Link>
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
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;