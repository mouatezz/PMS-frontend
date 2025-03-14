import React, { useState } from 'react';
import Sidebar from './SideBar';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

const EventsActivities = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    type: 'Event'
  });

  const [events, setEvents] = useState([
    {
      id: 'EVT-1001',
      name: 'Summer Pool Party',
      date: '2024-07-15',
      time: '14:00',
      location: 'Hotel Pool Area',
      type: 'Activity'
    },
    {
      id: 'EVT-1002',
      name: 'Wedding Reception',
      date: '2024-08-20',
      time: '18:00',
      location: 'Grand Ballroom',
      type: 'Event'
    }
  ]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Event': return 'bg-purple-500/20 text-purple-500';
      case 'Activity': return 'bg-amber-300/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    if (editingEventId) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEventId ? { ...newEvent, id: editingEventId } : event
      ));
      setEditingEventId(null);
    } else {
      // Create new event
      const newId = `EVT-${1000 + events.length + 1}`;
      setEvents([...events, { 
        id: newId, 
        ...newEvent 
      }]);
    }
    
    setNewEvent({
      name: '',
      date: '',
      time: '',
      location: '',
      type: 'Event'
    });
    setShowModal(false);
  };

  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setNewEvent({ ...eventToEdit });
      setEditingEventId(eventId);
      setShowModal(true);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All' || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-xl font-medium text-white">Events & Activities</h1>
            </div>
            <button 
              onClick={() => {
                setNewEvent({
                  name: '',
                  date: '',
                  time: '',
                  location: '',
                  type: 'Event'
                });
                setEditingEventId(null);
                setShowModal(true);
              }}
              className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add New</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-md p-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location or ID..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Event">Events</option>
                  <option value="Activity">Activities</option>
                </select>
                <Filter className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-300">{event.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleEditEvent(event.id)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-gray-400 text-sm">
              Showing {filteredEvents.length} of {events.length} events and activities
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-md max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">
                {editingEventId ? 'Edit Event/Activity' : 'Add New Event/Activity'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Time</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Type</label>
                  <select
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="Event">Event</option>
                    <option value="Activity">Activity</option>
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
                  <span>{editingEventId ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsActivities;