import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { CheckCircle, AlertCircle } from 'lucide-react';
import CreateGuestModal from '../../../components/CreateGuestModal';

const ReservationModal = ({
  isOpen,
  onClose,
  currentReservation,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  rooms,
  guests,
  fetchGuests, // Add this prop to allow refreshing the guest list
}) => {
  const [guestSearch, setGuestSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [isGuestValid, setIsGuestValid] = useState(true);
  const [isRoomValid, setIsRoomValid] = useState(true);
  const [datesSelected, setDatesSelected] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCurrentRoomUnavailable, setIsCurrentRoomUnavailable] = useState(false);
  const [showCreateGuestModal, setShowCreateGuestModal] = useState(false);

  const mealPlanOptions = [
    { value: 'RO', label: 'Room Only' },
    { value: 'BB', label: 'Bed & Breakfast' },
    { value: 'HB', label: 'Half Board (Breakfast & Dinner)' },
    { value: 'FB', label: 'Full Board (Breakfast, Lunch & Dinner)' },
    { value: 'AI', label: 'All Inclusive' },
  ];
  
  // Handler for the newly created guest
  const handleGuestCreated = (newGuest) => {
    // Update the form with the new guest info
    handleInputChange({ target: { name: 'guest', value: newGuest.username } });
    setGuestSearch(newGuest.fullname || newGuest.username);
    setIsGuestValid(true);
    
    // Refresh guest list if needed
    if (fetchGuests) fetchGuests();
  };
  
  useEffect(() => {
    if (currentReservation) {
      const currentGuest = guests.find(g => g.username === currentReservation.guest?.username || g.username === currentReservation.guest);
      setGuestSearch(currentGuest?.fullname || currentReservation.guest || '');
      
      const currentRoom = rooms.find(r => r.roomID === currentReservation.room?.roomID || r.roomID === currentReservation.room);
      setRoomSearch(currentRoom?.roomID || currentReservation.room || '');
      
      // Set dates selected to true when editing an existing reservation
      setDatesSelected(true);
    } else {
      // Reset fields for new reservation
      setGuestSearch('');
      setRoomSearch('');
      setDatesSelected(false);
    }
  }, [currentReservation, guests, rooms]);

  
  const fetchAvailableRooms = async (checkIn, checkOut) => {
    try {
      let url = `/backend/receptionist/availableRooms/?checkin=${checkIn}&checkout=${checkOut}`;
      if (currentReservation) {
        url += `&reservationID=${currentReservation.reservationID}`;
      }
      console.log(url);
      const response = await api.get(url);
      console.log(response.data);
      let availableRoomsList = response.data || [];
      
      if (!Array.isArray(availableRoomsList)) {
        availableRoomsList = [];
      }
      
     
      let currentRoomId = formData.room;
      
      if (currentReservation && currentReservation.room) {
        const reservationRoomId = typeof currentReservation.room === 'object' ? 
          currentReservation.room.roomID : currentReservation.room;
          
        // Only use the reservation's room if formData.room isn't set yet or they're the same
        if (!currentRoomId || currentRoomId === reservationRoomId) {
          currentRoomId = reservationRoomId;
        }
      }
      
      // If we have a room selected, check if it's available in the new date range
      if (currentRoomId) {
        const currentRoomExists = availableRoomsList.some(room => room.roomID === currentRoomId);
        
        // If we're editing, check if these are the original dates
        let isOriginalDateRange = true;
        if (currentReservation) {
          const originalCheckIn = new Date(currentReservation.check_in).toISOString().split('T')[0];
          const originalCheckOut = new Date(currentReservation.check_out).toISOString().split('T')[0];
          isOriginalDateRange = checkIn === originalCheckIn && checkOut === originalCheckOut;
        }
        
        if (!currentRoomExists) {
          // Show warning only if dates have changed from original
          setIsCurrentRoomUnavailable(!isOriginalDateRange);
          
          // If we're showing original dates, add the current room to available rooms
          if (isOriginalDateRange) {
            const currentRoom = rooms.find(r => r.roomID === currentRoomId);
            if (currentRoom) {
              availableRoomsList = [...availableRoomsList, currentRoom];
            }
          }
        } else {
          setIsCurrentRoomUnavailable(false);
        }
      }
      
      setAvailableRooms(availableRoomsList);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms(Array.isArray(rooms) ? rooms.filter(room => !room.is_occupied) : []);
    }
  };
   
  useEffect(() => {
    if (formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      
      if (checkIn && checkOut && checkOut > checkIn) {
        const diffTime = checkOut - checkIn;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        setDatesSelected(true);
        
        const formattedCheckIn = checkIn.toISOString().split('T')[0];
        const formattedCheckOut = checkOut.toISOString().split('T')[0];
        
        fetchAvailableRooms(formattedCheckIn, formattedCheckOut);
      } else {
        setNights(0);
        setDatesSelected(false);
      }
    } else {
      setDatesSelected(false);
    }
  }, [formData.check_in, formData.check_out]);

  useEffect(() => {
    if (formData.room && nights > 0 && rooms && rooms.length > 0) {
      const selectedRoom = rooms.find(r => r.roomID === formData.room);
      if (selectedRoom) {
        const calculatedPrice = selectedRoom.price * nights;
        setTotalPrice(calculatedPrice);
        
        setFormData(prev => ({
          ...prev,
          num_of_nights: nights,
          total_price: calculatedPrice
        }));
      }
    } else {
      setTotalPrice(0);
    }
  }, [formData.room, nights, rooms, setFormData]);

  const filteredGuests = guests ? guests.filter(guest => 
    guest.fullname?.toLowerCase().includes(guestSearch.toLowerCase()) ||
    guest.username?.toLowerCase().includes(guestSearch.toLowerCase())
  ) : [];

  const filteredRooms = datesSelected && availableRooms ? availableRooms.filter(room => 
    room.roomID?.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.room_type?.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.price?.toString().includes(roomSearch)
  ) : [];

  const handleGuestSelect = (guest) => {
    setGuestSearch(guest.fullname || guest.username);
    setIsGuestValid(true);
    setShowGuestDropdown(false);
    handleInputChange({ target: { name: 'guest', value: guest.username } });
  };

  const handleRoomSelect = (room) => {
    setRoomSearch(room.roomID);
    setIsRoomValid(true);
    setShowRoomDropdown(false);
    handleInputChange({ target: { name: 'room', value: room.roomID } });
    // Reset the unavailable warning when selecting a new room
    setIsCurrentRoomUnavailable(false);
  };

  const validateGuest = () => {
    if (!guests || guests.length === 0) {
      setIsGuestValid(false);
      return;
    }
    
    const isValid = guests.some(guest => 
      (guest.fullname && guest.fullname.toLowerCase() === guestSearch.toLowerCase()) || 
      (guest.username && guest.username.toLowerCase() === guestSearch.toLowerCase())
    );
    
    setIsGuestValid(isValid);
    if (!isValid) {
      handleInputChange({ target: { name: 'guest', value: '' } });
    }
    
    setTimeout(() => setShowGuestDropdown(false), 200);
  };

  const validateRoom = () => {
    if (!availableRooms || availableRooms.length === 0) {
      setIsRoomValid(false);
      return;
    }
    
    const isValid = availableRooms.some(room => 
      (room.roomID && room.roomID.toLowerCase() === roomSearch.toLowerCase()) || 
      (room.room_type && room.room_type.toLowerCase() === roomSearch.toLowerCase())
    );
    
    setIsRoomValid(isValid);
    if (!isValid) {
      handleInputChange({ target: { name: 'room', value: '' } });
    }
    
    setTimeout(() => setShowRoomDropdown(false), 200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.guest || formData.guest === '') {
      setIsGuestValid(false);
      return;
    }
    
    if (!formData.room || formData.room === '') {
      setIsRoomValid(false);
      return;
    }
    
    if (!datesSelected) {
      return;
    }
    
    // Format dates as YYYY-MM-DD for backend
    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    
    const updatedFormData = {
      ...formData,
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      num_of_nights: nights,
      total_price: totalPrice,
      meal_plan: formData.meal_plan || 'RO'
    };
    
    setFormData(updatedFormData);
    handleSubmit(e);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentReservation ? 'Edit Reservation' : 'New Reservation'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowCreateGuestModal(true)} 
            className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Guest
          </button>
        </div>
        
        {showCreateGuestModal && (
          <CreateGuestModal 
            isOpen={showCreateGuestModal}
            onClose={() => setShowCreateGuestModal(false)}
            onGuestCreated={() => fetchGuests()}
            existingGuests={guests || []}
          />
        )}
        
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           
            <div className="relative">
              <label className="block text-gray-700 mb-1">Guest</label>
              <input
                type="text"
                value={guestSearch}
                onChange={(e) => {
                  setGuestSearch(e.target.value);
                  setShowGuestDropdown(true);
                }}
                onFocus={() => setShowGuestDropdown(true)}
                onBlur={validateGuest}
                className={`w-full px-3 py-2 border ${isGuestValid ? 'border-gray-300' : 'border-red-500'} text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                placeholder="Search guest by name or username..."
                required
              />
              {!isGuestValid && <p className="text-red-500 text-sm mt-1">GUEST UNDEFINED</p>}
              
              {showGuestDropdown && guestSearch && guests && guests.length > 0 && (
                <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => (
                      <div
                        key={guest.username}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleGuestSelect(guest);
                        }}
                        className="p-2 cursor-pointer hover:bg-amber-50"
                      >
                        <div className="font-medium">{guest.fullname}</div>
                        <div className="text-sm text-gray-500">{guest.username}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No matches found</div>
                  )}
                </div>
              )}
            </div>

            {/* National ID */}
            <div>
              <label className="block text-gray-700 mb-1">National ID</label>
              <input
                type="text"
                name="NationalID"
                value={formData.NationalID || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-gray-700 mb-1">Check-in Date</label>
              <input
                type="date"
                name="check_in"
                value={formData.check_in?.split('T')[0] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-gray-700 mb-1">Check-out Date</label>
              <input
                type="date"
                name="check_out"
                value={formData.check_out?.split('T')[0] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Room Selection */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Room</label>
              <input
                type="text"
                value={roomSearch}
                onChange={(e) => {
                  setRoomSearch(e.target.value);
                  setShowRoomDropdown(true);
                }}
                onFocus={() => setShowRoomDropdown(true)}
                onBlur={() => {
                  // Use setTimeout to allow click events on dropdown to fire before hiding
                  setTimeout(() => {
                    setShowRoomDropdown(false);
                    validateRoom();
                  }, 200);
                }}
                className={`w-full px-3 py-2 border ${isRoomValid ? 'border-gray-300' : 'border-red-500'} 
                  text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500
                  ${!datesSelected ? 'bg-gray-200' : ''}`}
                placeholder={datesSelected ? "Search room by ID, type, or price..." : "Select dates first"}
                disabled={!datesSelected}
                required
              />
              {!isRoomValid && <p className="text-red-500 text-sm mt-1">ROOM UNDEFINED</p>}
              {!datesSelected && <p className="text-gray-500 text-sm mt-1">You must select dates first</p>}
              {isCurrentRoomUnavailable && (
                <div className="flex items-center mt-1 text-amber-700">
                  <AlertCircle size={16} className="mr-1" />
                  <p className="text-sm">Selected room is not available for these dates</p>
                </div>
              )}
              
              {showRoomDropdown && datesSelected && availableRooms && availableRooms.length > 0 && (
                <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                      <div
                        key={room.roomID}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleRoomSelect(room);
                        }}
                        className="p-2 cursor-pointer hover:bg-amber-50"
                      >
                        <div className="font-medium">Room {room.roomID} - {room.room_type}</div>
                        <div className="text-sm text-gray-500">${room.price}/night</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No matching rooms found</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Calculated Fields */}
            <div>
              <label className="block text-gray-700 mb-1">Nights</label>
              <input
                type="number"
                value={nights}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-md"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Total Price</label>
              <input
                type="text"
                value={`$${totalPrice.toFixed(2)}`}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-md"
                disabled
              />
            </div>
            <div>
              <label htmlFor="meal_plan" className="block text-gray-700 mb-1">Meal Plan</label>
              <select id="meal_plan" name="meal_plan" value={formData.meal_plan || 'RO'} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                {mealPlanOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            {/* Status Options - Added for both new and edit */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Reservation Status</label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_checked_in"
                    name="is_checked_in"
                    checked={formData.is_checked_in || false}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <label htmlFor="is_checked_in" className="ml-2 text-gray-700">
                    Checked In
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_checked_out"
                    name="is_checked_out"
                    checked={formData.is_checked_out || false}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <label htmlFor="is_checked_out" className="ml-2 text-gray-700">
                    Checked Out
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_cancelled"
                    name="is_cancelled"
                    checked={formData.is_cancelled || false}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <label htmlFor="is_cancelled" className="ml-2 text-gray-700">
                    Cancelled
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${
                isGuestValid && isRoomValid && datesSelected && !isCurrentRoomUnavailable
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-amber-300 cursor-not-allowed'
              } text-white font-medium rounded-md transition duration-200`}
              disabled={!isGuestValid || !isRoomValid || !datesSelected || isCurrentRoomUnavailable}
            >
              {currentReservation ? 'Update' : 'Create'} Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;