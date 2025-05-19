import React, { useState, useEffect, useCallback } from 'react';
import ReceptionistSidebar from './ReceptionistSideBar';
import { 
  Search,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Users,
  X,
  PlusCircle,
  BedDouble,
  CalendarDays
} from 'lucide-react';
import api from '../../api';
import QRCodePopup from '../../components/QRCodePopup';

const WalkInCheckInPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [reservationID, setReservationID] = useState(null);
  const [pay, setPay] = useState(false);
  const [roomSearchTerm, setRoomSearchTerm] = useState('');
  const [guestSearchTerm, setGuestSearchTerm] = useState('');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [companions, setCompanions] = useState([]);
  const [payment, setPayment] = useState({
    amount: 0,
    type: "stay",
    payment_method: "cash",
  });

  const [reservation, setReservation] = useState({
    guest: null,
    NationalID: '',
    room: null,
    check_in: new Date().toISOString().split('T')[0],
    check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    num_of_nights: 1,
    total_price: 0,
    is_checked_in: true,
    is_checked_out: false,
    is_cancelled: false,
    meal_plan: 'RO'
  });

  // Fetch available rooms based on check-in and check-out dates
  const fetchAvailableRooms = useCallback(async (checkIn, checkOut) => {
    try {
      let url = `/backend/receptionist/availableRooms/?checkin=${checkIn}&checkout=${checkOut}`;
      console.log(url);
      const response = await api.get(url);
      console.log('Available rooms:', response.data);
      setAvailableRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  }, []);

  // Fetch all rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await api.get('/backend/hotel_admin/rooms/');
      console.log('All rooms:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  // Fetch all guests
  const fetchGuests = useCallback(async () => {
    try {
      const response = await api.get('backend/hotel_admin/guests/');
      console.log('All guests:', response.data);
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchGuests();
    fetchAvailableRooms(reservation.check_in, reservation.check_out);
  }, [fetchRooms, fetchGuests, fetchAvailableRooms, reservation.check_in, reservation.check_out]);

  // Calculate number of nights and total price when dates change
  useEffect(() => {
    if (reservation.check_in && reservation.check_out) {
      const checkInDate = new Date(reservation.check_in);
      const checkOutDate = new Date(reservation.check_out);
      const timeDiff = checkOutDate - checkInDate;
      const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setReservation(prev => ({
          ...prev,
          num_of_nights: nights
        }));
      }
    }
  }, [reservation.check_in, reservation.check_out]);

  // Meal plan price mapping
  const mealPlanPrices = {
    'RO': 0.0,
    'BB': 500.0,
    'HB': 1000.0,
    'FB': 2000.0,
    'AI': 4000.0,
  };

  // Update total price when room, nights, or meal plan change
  useEffect(() => {
    if (reservation.room && reservation.num_of_nights) {
      const selectedRoom = availableRooms.find(room => room.roomID === reservation.room);
      if (selectedRoom && selectedRoom.price) {
        const roomCost = selectedRoom.price * reservation.num_of_nights;
        const mealPlanCost = mealPlanPrices[reservation.meal_plan] * reservation.num_of_nights;
        const totalPrice = roomCost + mealPlanCost;
        
        setReservation(prev => ({
          ...prev,
          total_price: totalPrice
        }));
        setPayment(prev => ({
          ...prev,
          amount: totalPrice
        }));
      }
    }
  }, [reservation.room, reservation.num_of_nights, reservation.meal_plan, availableRooms]);

  const addCompanion = () => {
    setCompanions([...companions, { fullName: '', NationalID: '', phoneNumber: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedCompanions = [...companions];
    updatedCompanions[index][field] = value;
    setCompanions(updatedCompanions);
  };

  const handleSelectRoom = (room) => {
    setReservation(prev => {
      // Calculate total price with meal plan
      const roomCost = room.price_per_night * prev.num_of_nights;
      const mealPlanCost = mealPlanPrices[prev.meal_plan] * prev.num_of_nights;
      const totalPrice = roomCost + mealPlanCost;
      
      return {
        ...prev,
        room: room.roomID,
        total_price: totalPrice
      };
    });
    setRoomSearchTerm(room.roomID);
    setShowRoomDropdown(false);
  };

  const handleSelectGuest = (guest) => {
    setReservation(prev => ({
      ...prev,
      guest: guest.username
    }));
    setGuestSearchTerm(guest.fullname);
    setShowGuestDropdown(false);
  };

  const handleCheckInSubmit = async () => {
    try {
      const data = {
        guest: reservation.guest,
        NationalID: reservation.NationalID,
        room: reservation.room,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        num_of_nights: reservation.num_of_nights,
        total_price: reservation.total_price,
        is_checked_in: reservation.is_checked_in,
        is_checked_out: reservation.is_checked_out,
        is_cancelled: reservation.is_cancelled,
        meal_plan: reservation.meal_plan,
        companions: companions.map((companion) => ({
          fullname: companion.fullName,
          NationalID: companion.NationalID,
          phone: companion.phoneNumber,
        })),
        payment: pay ? [payment] : [],
      };

      console.log('Submitting walk-in check-in:', data);
      const response = await api.post('/backend/receptionist/walkincheckin/', data);
      console.log('Walk-in check-in response:', response.data);
      
      setReservationID(response.data.reservationID);
      setShowQR(true);
    } catch (error) {
      console.error('Error during walk-in check-in:', error);
    }
  };

  const filteredRooms = roomSearchTerm 
    ? availableRooms.filter(room => 
        room.roomID.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(roomSearchTerm.toLowerCase()))
    : availableRooms;

  const filteredGuests = guestSearchTerm
    ? guests.filter(guest => 
        guest.fullname.toLowerCase().includes(guestSearchTerm.toLowerCase()) ||
        guest.username.toLowerCase().includes(guestSearchTerm.toLowerCase()))
    : guests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Walk-In Check-In</h1>
          </div>
        </header>
        
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">New Walk-in Check-in</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-500" />
                    Guest Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm text-gray-600 mb-1">Select Guest</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          placeholder="Search for a guest..."
                          value={guestSearchTerm}
                          onChange={(e) => {
                            setGuestSearchTerm(e.target.value);
                            setShowGuestDropdown(true);
                          }}
                          onFocus={() => setShowGuestDropdown(true)}
                        />
                        {showGuestDropdown && filteredGuests.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredGuests.map((guest) => (
                              <div
                                key={guest.username}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectGuest(guest)}
                              >
                                <div className="font-medium">{guest.fullname}</div>
                                <div className="text-sm text-gray-600">{guest.username}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">National ID</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={reservation.NationalID}
                        onChange={(e) => setReservation({...reservation, NationalID: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <BedDouble className="h-5 w-5 mr-2 text-amber-500" />
                    Room Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                      <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
                      <input 
                        type="date"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={reservation.check_in}
                        onChange={(e) => {
                          setReservation({...reservation, check_in: e.target.value});
                          fetchAvailableRooms(e.target.value, reservation.check_out);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
                      <input 
                        type="date"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={reservation.check_out}
                        onChange={(e) => {
                          setReservation({...reservation, check_out: e.target.value});
                          fetchAvailableRooms(reservation.check_in, e.target.value);
                        }}
                        min={reservation.check_in}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-gray-600 mb-1">Select Room</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          placeholder="Search for a room..."
                          value={roomSearchTerm}
                          onChange={(e) => {
                            setRoomSearchTerm(e.target.value);
                            setShowRoomDropdown(true);
                          }}
                          onFocus={() => setShowRoomDropdown(true)}
                        />
                        {showRoomDropdown && filteredRooms.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredRooms.map((room) => (
                              <div
                                key={room.roomID}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectRoom(room)}
                              >
                                <div className="font-medium">Room {room.roomID}</div>
                                <div className="text-sm text-gray-600">
                                  {room.room_type} - {room.price_per_night} DA per night
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Room Type</label>
                      <select
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={availableRooms.find(room => room.roomID === reservation.room)?.room_type || ''}
                        disabled
                      >
                        <option value="">Select a room first</option>
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                      </select>
                    </div>
                  
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Number of Nights</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={reservation.num_of_nights}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Meal Plan</label>
                      <select
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={reservation.meal_plan}
                        onChange={(e) => setReservation({...reservation, meal_plan: e.target.value})}
                      >
                        <option value="RO">Room Only (RO) - No additional cost</option>
                        <option value="BB">Bed & Breakfast (BB) - 500 DA per night</option>
                        <option value="HB">Half Board (HB) - 1000 DA per night</option>
                        <option value="FB">Full Board (FB) - 2000 DA per night</option>
                        <option value="AI">All Inclusive (AI) - 4000 DA per night</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Clipboard className="h-5 w-5 mr-2 text-amber-500" />
                    Companions
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm text-gray-600">Companion Details</label>
                      <button 
                        className="text-amber-600 text-sm flex items-center ml-auto"
                        onClick={addCompanion}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Companion
                      </button>
                    </div>
                    
                    {companions.map((companion, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded-lg p-3 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={companion.fullName}
                            onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <input
                            type="text"
                            placeholder="National ID"
                            value={companion.NationalID}
                            onChange={(e) => handleInputChange(index, 'NationalID', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={companion.phoneNumber}
                            onChange={(e) => handleInputChange(index, 'phoneNumber', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-amber-500" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    
                    <div>
                    
                      <div className="text-base mt-1 p-3 bg-white border border-gray-200 rounded-lg">
                        {reservation.room && availableRooms.find(room => room.roomID === reservation.room) ? (
                          <>
                            <div className="flex justify-between mb-2">
                              <span>Room rate:</span>
                              <span>{availableRooms.find(room => room.roomID === reservation.room).price * reservation.num_of_nights} DZD</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Meal plan ({reservation.meal_plan}):</span>
                              <span>{mealPlanPrices[reservation.meal_plan] * reservation.num_of_nights} DZD </span>
                            </div>
                            <div className="flex justify-between font-medium pt-1 border-t border-gray-200 mt-4 mb-4">
                              <span>Total:</span>
                              
                             <span>{reservation.total_price ? reservation.total_price: '0'} DZD</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">Select a room to see price details</span>
                        )}
                      </div>
                    </div>
                    {!pay && (
                      <div className='flex justify-end'> 
                        <button 
                          className='bg-amber-50 rounded-lg p-2 border border-amber-200 text-amber-700'
                          onClick={() => {
                            setPay(true);
                            setPayment({ ...payment, amount: reservation.total_price });
                          }}
                        >
                          Process payment
                        </button>
                      </div>  
                    )}
                    {pay && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                        <select 
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          value={payment.payment_method}
                          onChange={(e) => setPayment({ ...payment, payment_method: e.target.value })}
                        >
                          <option value="cash">Cash</option>
                          <option value="credit">Credit Card</option>
                          <option value="bank">Bank Transfer</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h3 className="font-medium text-amber-700 mb-3 flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Reservation Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="isCheckedIn" 
                        className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        checked={reservation.is_checked_in}
                        onChange={(e) => setReservation({...reservation, is_checked_in: e.target.checked})}
                      />
                      <label htmlFor="isCheckedIn" className="ml-2 text-sm text-gray-700">
                        Mark as Checked In
                      </label>
                    </div>
                    <div className="text-sm text-gray-600 mt-4">
                      <p>A walk-in reservation will be created and the guest will be immediately checked in.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors"
                onClick={handleCheckInSubmit}
                disabled={!reservation.guest || !reservation.room || !reservation.NationalID}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Complete Check-in</span>
              </button>
            </div>
            
            {showQR && reservationID && (
              <QRCodePopup 
                reservationId={reservationID}
                onClose={() => setShowQR(false)}
                onClose2={() => window.history.back()}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalkInCheckInPage;