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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]); 
  const [reservations, setReservations] = useState([]);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

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

  const fetchReservations = async (page = 1) => {
    try {
      const response = await api.get('/backend/receptionist/reservationPagination/', {
        params: {
          page: page,
          limit: itemsPerPage
        }
      });
      
      // Assuming the backend returns data in this format
      // { data: [...reservations], total: totalCount, pages: totalPages }
      console.log(response.data);
      
      // If your backend doesn't return pagination info, adjust accordingly
      setReservations(response.data.data || response.data);
      setTotalItems(response.data.total || response.data.length);
      setTotalPages(response.data.pages || Math.ceil((response.data.total || response.data.length) / itemsPerPage));
      setCurrentPage(page);
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
    fetchReservations(currentPage);  
    fetchGuests();
    fetchRooms();
  }, [currentPage, itemsPerPage]);

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
        res.guest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.NationalID?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchReservations(newPage);
    }
  };

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
    const checkInDate = reservation.check_in?.includes('T') 
      ? reservation.check_in.split('T')[0] 
      : reservation.check_in;
      
    const checkOutDate = reservation.check_out?.includes('T') 
      ? reservation.check_out.split('T')[0] 
      : reservation.check_out;
    
    setFormData({
      guest: typeof reservation.guest === 'object' ? reservation.guest.username : reservation.guest,
      NationalID: reservation.NationalID || '',
      room: typeof reservation.room === 'object' ? reservation.room.roomID : reservation.room,
      check_in: checkInDate,
      check_out: checkOutDate,
      num_of_nights: reservation.num_of_nights,
      total_price: reservation.total_price,
      is_checked_in: reservation.is_checked_in || false,
      is_checked_out: reservation.is_checked_out || false,
      is_cancelled: reservation.is_cancelled || false,
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
      const response = await api.delete(`backend/receptionist/ManageReservation/${reservationToDelete.reservationID}`);
      console.log(response.data);
      fetchReservations(currentPage);
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
  
  const handleCancelReservation = (reservationID) => {
    const reservation = reservations.find(res => res.reservationID === reservationID);
    setReservationToCancel(reservation);
    setIsCancelModalOpen(true);
  };
  
  const confirmCancelReservation = async () => {
    if (reservationToCancel) {
      try {
        const response = await api.post(`backend/receptionist/ManageReservation/${reservationToCancel.reservationID}`);
        console.log(response.data);
        fetchReservations(currentPage);
        setIsCancelModalOpen(false);
        setReservationToCancel(null);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
      }
    }
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
        console.log(formData)
        const response = await api.put(`backend/receptionist/ManageReservation/${currentReservation.reservationID}`, formData);
        console.log('Updated reservation:', response.data);
      } else {
        console.log('Creating new reservation:', formData);
        const response = await api.post('backend/receptionist/reservations/', formData);
        console.log('Created reservation:', response.data);
      }
      fetchReservations(currentPage);
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

  const CancelConfirmationModal = ({ isOpen, onClose, onConfirm, reservation }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to cancel the reservation for{' '}
            <span className="font-medium">{reservation?.guest || 'this guest'}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-200"
            >
              No, Keep Reservation
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
            >
              Yes, Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pagination component with blue buttons
  const Pagination = () => {
    return (
      <div className="flex justify-between items-center mt-6 px-2">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} reservations
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
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
              handleCancelReservation={handleCancelReservation}
              handleEditReservation={handleEditReservation}
              handleDeleteReservation={handleDeleteReservation}
            />
            
            {/* Add the pagination component */}
            <Pagination />
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
          
          <CancelConfirmationModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={confirmCancelReservation}
            reservation={reservationToCancel}
          />
        </main>
      </div>
    </div>
  ); 
}; 

export default ReservationManagement;