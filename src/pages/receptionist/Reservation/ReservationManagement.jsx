import React, { useState, useEffect } from 'react';
import ReceptionistSidebar from '../ReceptionistSideBar';
import SearchBar from './SearchBar';
import ReservationTable from './ReservationTable';
import ReservationModal from './ReservationModal';
import api from '../../../api.js'; 

const ReservationManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]); // Added rooms state back
  const [reservations, setReservations]= useState(
    [
      {
        reservationID: 1,
        guest: 'John Doe' ,
        NationalID: 'ABC123456',
        room:'R101',
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
    ]
  );
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

  const fetchReservations = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/reservations/');
      console.log(response.data);
      setReservations(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/backend/hotel_admin/rooms/');
      console.log('Rooms:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {   
    fetchReservations();  
    fetchGuests();
    fetchRooms(); // Added fetchRooms call
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await api.get('backend/hotel_admin/guests/');
      setGuests(response.data);
      console.log('Guests:', response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };
  
  useEffect(() => {
    let filtered = [...reservations];
    
    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    });
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation) => {
    setCurrentReservation(reservation);
    setFormData({
      guest: reservation.guest,
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

  const confirmDeleteReservation = async () => {
    if (reservationToDelete) {
      const response = await api.delete(`backend/hotel_admin/ManageReservation/${reservationToDelete.reservationID}`);
      console.log(response.data);
      fetchReservations();
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

  const handleCancel = async(reservationID) => {
    const response = await api.post(`backend/hotel_admin/ManageReservation/${reservationID}`);
    console.log(response.data);
    fetchReservations();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentReservation) {
        const response = await api.put(`backend/hotel_admin/ManageReservation/${currentReservation.reservationID}`, formData);
        console.log('Updated reservation:', response.data);
      } else {
        console.log('Creating new reservation:', formData);
        const response = await api.post('backend/hotel_admin/reservations/', formData);
        console.log('Created reservation:', response.data);
      }
      fetchReservations();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, reservation }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the reservation for{' '}
            <span className="font-medium">{reservation?.guest || 'this guest'}</span>?
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
        <header className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Reservations</h1>
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
              handleCancel={handleCancel}
              handleEditReservation={handleEditReservation}
              handleDeleteReservation={handleDeleteReservation}
            />
          </div>
          
          <ReservationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            currentReservation={currentReservation}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
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