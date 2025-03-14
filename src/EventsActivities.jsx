import React, { useState } from 'react';
import Sidebar from './SideBar';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle2,
  X,
  Calendar,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

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
    type: 'Event',
    imageUrl: '/api/placeholder/600/400'
  });

  const [events, setEvents] = useState([
    {
      id: 'EVT-1001',
      name: 'Summer Pool Party',
      date: '2024-07-15',
      time: '14:00',
      location: 'Hotel Pool Area',
      type: 'Activity',
      imageUrl: 'https://as2.ftcdn.net/v2/jpg/03/86/13/33/1000_F_386133321_K9KI3XQ0HHco4mgJNlPCbNvqCICrzCw9.jpg',
      description: 'Enjoy a refreshing afternoon by the pool with music and refreshments.'
    },
    {
      id: 'EVT-1002',
      name: 'Wedding Reception',
      date: '2024-08-20',
      time: '18:00',
      location: 'Grand Ballroom',
      type: 'Event',
      imageUrl: 'https://as1.ftcdn.net/v2/jpg/02/94/88/20/1000_F_294882058_QXbbrcpLbyNT0bp7KbqDSNXwPUJBYbDp.jpg',
      description: 'Celebrate the union of Mr. and Mrs. Smith with dinner and dancing.'
    },
    {
      id: 'EVT-1003',
      name: 'Yoga Session',
      date: '2024-06-10',
      time: '08:00',
      location: 'Beach Front',
      type: 'Activity',
      imageUrl: 'https://as1.ftcdn.net/v2/jpg/09/89/03/84/1000_F_989038477_eIRaQtUP40ZC3nhldxC5dTVMHey8XCP9.jpg',
      description: 'Start your day with a relaxing yoga session by the beach.'
    },
    {
      id: 'EVT-1004',
      name: 'Annual Gala',
      date: '2024-09-05',
      time: '19:30',
      location: 'Embassy Ballroom',
      type: 'Event',
      imageUrl: 'https://as1.ftcdn.net/v2/jpg/13/19/03/76/1000_F_1319037697_5tbFFWoAlW4uiM0vs9lZyqoCgxmBjP8j.jpg',
      description: 'Our prestigious annual fundraising event with live entertainment.'
    }
  ]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Event': return 'bg-purple-500/20 text-purple-500 border-purple-500';
      case 'Activity': return 'bg-amber-300/20 text-amber-300 border-amber-300';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: format(date, 'MMM'),
      weekday: format(date, 'EEE'),
      formattedDate: format(date, 'MMM d, yyyy')
    };
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
        ...newEvent,
        description: newEvent.description || 'No description provided.'
      }]);
    }
    
    setNewEvent({
      name: '',
      date: '',
      time: '',
      location: '',
      type: 'Event',
      imageUrl: '/api/placeholder/600/400',
      description: ''
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
              <h1 className="text-2xl font-semibold text-white">Events & Activities</h1>
            </div>
            <button 
              onClick={() => {
                setNewEvent({
                  name: '',
                  date: '',
                  time: '',
                  location: '',
                  type: 'Event',
                  imageUrl: '/api/placeholder/600/400',
                  description: ''
                });
                setEditingEventId(null);
                setShowModal(true);
              }}
              className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add New</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-6">
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

            {/* Card Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const dateInfo = formatDate(event.date);
                return (
                <div key={event.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4 bg-gray-900/80 rounded-lg p-2 text-center min-w-12">
                      <div className="text-amber-300 text-xs font-medium">{dateInfo.month}</div>
                      <div className="text-white text-xl font-bold">{dateInfo.day}</div>
                      <div className="text-gray-300 text-xs">{dateInfo.weekday}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white text-lg font-medium mb-2">{event.name}</h3>
                      <span className="text-amber-300 text-sm font-medium">{event.id}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{dateInfo.formattedDate}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditEvent(event.id)}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 p-2 rounded-md transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="bg-gray-700/50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-lg">No events or activities found</div>
                <div className="text-gray-500 mt-2">Try adjusting your search or filters</div>
              </div>
            )}

            <div className="mt-6 text-gray-400 text-sm">
              Showing {filteredEvents.length} of {events.length} events and activities
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-medium text-lg">
                {editingEventId ? 'Edit Event/Activity' : 'Add New Event/Activity'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    placeholder="Event name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Time</label>
                    <input 
                      type="time" 
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>

                <div></div><div>
                  <label className="block text-gray-300 mb-1 font-medium">Location</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="eventType"
                        value="Event"
                        checked={newEvent.type === 'Event'}
                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                        className="form-radio text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-white">Event</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="eventType"
                        value="Activity"
                        checked={newEvent.type === 'Activity'}
                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                        className="form-radio text-amber-300 focus:ring-amber-300"
                      />
                      <span className="text-white">Activity</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Image URL</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({...newEvent, imageUrl: e.target.value})}
                    placeholder="Image URL"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave default for placeholder image</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-24"
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Event description"
                  />
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