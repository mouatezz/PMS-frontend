import React, { useState, useEffect } from 'react';
import ReceptionistSidebar from '../ReceptionistSideBar';
import SearchBar from './SearchBar';
import ReservationTable from './ReservationTable';
import ReservationModal from './ReservationModal';

const ReservationManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({
    guest: '',
    NationalID: '',
    room: '',
    check_in: '',
    check_out: '',
    num_of_nights: 1,
    total_price: 0,
    is_checked_in: false,
    is_checked_out: false,
    is_cancelled: false,
    companions: []
  });
  const [companionData, setCompanionData] = useState({
    fullname: '',
    NationalID: '',
    phone: ''
  });

  useEffect(() => {
    const mockReservations = [
      {
        reservationID: 1,
        guest: { user: { username: 'guest1', fullname: 'John Doe' }},
        NationalID: 'ABC123456',
        room: { roomID: 'R101', room_type: 'deluxe', price: 150.00 },
        check_in: '2025-03-22T14:00:00',
        check_out: '2025-03-25T12:00:00',
        num_of_nights: 3,
        total_price: 450.00,
        is_checked_in: true,
        is_checked_out: false,
        is_cancelled: false,
        guest_companions: [
          { fullname: 'Jane Doe', NationalID: 'XYZ987654', phone: '555-1234' }
        ],
        payments: [
          { paymentID: 'PAY001', payment_method: 'credit', amount: 450.00, date: '2025-03-20T10:30:00' }
        ]
      }
    ];

    const mockRooms = [
      { roomID: 'R101', room_type: 'deluxe', price: 150.00, is_occupied: true },
      { roomID: 'R102', room_type: 'standard', price: 100.00, is_occupied: false }
    ];

    const mockGuests = [
      { user: { username: 'guest1', fullname: 'John Doe', email: 'john@example.com' }},
      { user: { username: 'guest2', fullname: 'Sarah Smith', email: 'sarah@example.com' }}
    ];

    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
    setRooms(mockRooms);
    setGuests(mockGuests);
  }, []);

  useEffect(() => {
    let filtered = [...reservations];
    
    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.guest.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.room.roomID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.NationalID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'checked-in':
          filtered = filtered.filter(res => res.is_checked_in && !res.is_checked_out);
          break;
        case 'checked-out':
          filtered = filtered.filter(res => res.is_checked_out);
          break;
        case 'upcoming':
          filtered = filtered.filter(res => !res.is_checked_in && !res.is_cancelled);
          break;
        case 'cancelled':
          filtered = filtered.filter(res => res.is_cancelled);
          break;
      }
    }
    
    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations]);

  const handleAddReservation = () => {
    setCurrentReservation(null);
    setFormData({
      guest: '',
      NationalID: '',
      room: '',
      check_in: '',
      check_out: '',
      num_of_nights: 1,
      total_price: 0,
      is_checked_in: false,
      is_checked_out: false,
      is_cancelled: false,
      companions: []
    });
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation) => {
    setCurrentReservation(reservation);
    setFormData({
      guest: reservation.guest.user.username,
      NationalID: reservation.NationalID,
      room: reservation.room.roomID,
      check_in: reservation.check_in.slice(0, 16),
      check_out: reservation.check_out.slice(0, 16),
      num_of_nights: reservation.num_of_nights,
      total_price: reservation.total_price,
      is_checked_in: reservation.is_checked_in,
      is_checked_out: reservation.is_checked_out,
      is_cancelled: reservation.is_cancelled,
      companions: reservation.guest_companions || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteReservation = (reservationID) => {
    const reservation = reservations.find(res => res.reservationID === reservationID);
    setReservationToDelete(reservation);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteReservation = () => {
    if (reservationToDelete) {
      setReservations(reservations.filter(res => res.reservationID !== reservationToDelete.reservationID));
      setIsDeleteModalOpen(false);
      setReservationToDelete(null);
    }
  };

  const handleCheckIn = (reservationID) => {
    setReservations(reservations.map(res => 
      res.reservationID === reservationID 
        ? { ...res, is_checked_in: true } 
        : res
    ));
  };

  const handleCheckOut = (reservationID) => {
    setReservations(reservations.map(res => 
      res.reservationID === reservationID 
        ? { ...res, is_checked_out: true } 
        : res
    ));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'check_in' || name === 'check_out') {
      if (formData.check_in && formData.check_out) {
        const checkIn = new Date(name === 'check_in' ? value : formData.check_in);
        const checkOut = new Date(name === 'check_out' ? value : formData.check_out);
        
        if (checkIn && checkOut && checkOut > checkIn) {
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          const room = rooms.find(r => r.roomID === formData.room);
          const roomPrice = room ? room.price : 0;
          
          setFormData(prev => ({
            ...prev,
            num_of_nights: nights,
            total_price: nights * roomPrice
          }));
        }
      }
    }

    if (name === 'room') {
      const room = rooms.find(r => r.roomID === value);
      if (room && formData.num_of_nights) {
        setFormData(prev => ({
          ...prev,
          total_price: prev.num_of_nights * room.price
        }));
      }
    }
  };

  const handleCompanionInputChange = (e) => {
    const { name, value } = e.target;
    setCompanionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCompanion = () => {
    if (companionData.fullname && companionData.NationalID && companionData.phone) {
      setFormData(prev => ({
        ...prev,
        companions: [...prev.companions, { ...companionData }]
      }));
      setCompanionData({ fullname: '', NationalID: '', phone: '' });
    }
  };

  const removeCompanion = (index) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentReservation) {
      setReservations(reservations.map(res => 
        res.reservationID === currentReservation.reservationID 
          ? {
              ...res,
              guest: guests.find(g => g.user.username === formData.guest),
              NationalID: formData.NationalID,
              room: rooms.find(r => r.roomID === formData.room),
              check_in: formData.check_in,
              check_out: formData.check_out,
              num_of_nights: formData.num_of_nights,
              total_price: formData.total_price,
              is_checked_in: formData.is_checked_in,
              is_checked_out: formData.is_checked_out,
              is_cancelled: formData.is_cancelled,
              guest_companions: formData.companions
            } 
          : res
      ));
    } else {
      const newReservation = {
        reservationID: Date.now(),
        guest: guests.find(g => g.user.username === formData.guest),
        NationalID: formData.NationalID,
        room: rooms.find(r => r.roomID === formData.room),
        check_in: formData.check_in,
        check_out: formData.check_out,
        num_of_nights: formData.num_of_nights,
        total_price: formData.total_price,
        is_checked_in: formData.is_checked_in,
        is_checked_out: formData.is_checked_out,
        is_cancelled: formData.is_cancelled,
        guest_companions: formData.companions,
        payments: []
      };
      setReservations([...reservations, newReservation]);
    }
    
    setIsModalOpen(false);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, reservation }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the reservation for{' '}
            <span className="font-medium">{reservation?.guest?.user?.fullname || 'this guest'}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Reservations</h1>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                R
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-6">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              handleAddReservation={handleAddReservation}
            />
            
            <ReservationTable
              filteredReservations={filteredReservations}
              handleCheckIn={handleCheckIn}
              handleCheckOut={handleCheckOut}
              handleEditReservation={handleEditReservation}
              handleDeleteReservation={handleDeleteReservation}
            />
          </div>
          
          <ReservationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            currentReservation={currentReservation}
            formData={formData}
            handleInputChange={handleInputChange}
            companionData={companionData}
            handleCompanionInputChange={handleCompanionInputChange}
            addCompanion={addCompanion}
            removeCompanion={removeCompanion}
            handleSubmit={handleSubmit}
            rooms={rooms}
            guests={guests}
          />
          
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteReservation}
            reservation={reservationToDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default ReservationManagement;