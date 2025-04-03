import React, { useState } from 'react';
import ReceptionistSidebar from './ReceptionistSideBar';
import { 
  DoorOpen,
  Search,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Key,
  ClipboardCheck,
  Users,
  X,
  PlusCircle,
  BedDouble
} from 'lucide-react';

const CheckInPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // Sample data aligned with Django models
  const expectedCheckIns = [
    { 
      reservationID: 1, 
      guest: {
        user: {
          username: 'dmiller',
          fullname: 'David Miller',
          email: 'david.miller@example.com',
          phone: '(555) 123-4567',
        }
      },
      NationalID: 'AB123456',
      room: {
        roomID: '402', 
        room_type: 'deluxe',
        price: 150.00
      },
      check_in: '2024-03-19', 
      check_out: '2024-03-22', 
      num_of_nights: 3,
      total_price: 450.00,
      is_checked_in: false,
      is_checked_out: false,
      is_cancelled: false
    },
    { 
      reservationID: 2, 
      guest: {
        user: {
          username: 'sclark',
          fullname: 'Susan Clark',
          email: 'susan.clark@example.com',
          phone: '(555) 234-5678',
        }
      },
      NationalID: 'CD789012',
      room: {
        roomID: '215', 
        room_type: 'standard',
        price: 120.00
      },
      check_in: '2024-03-19', 
      check_out: '2024-03-20', 
      num_of_nights: 1,
      total_price: 120.00,
      is_checked_in: false,
      is_checked_out: false,
      is_cancelled: false
    },
    { 
      reservationID: 3, 
      guest: {
        user: {
          username: 'pwilson',
          fullname: 'Peter Wilson',
          email: 'peter.wilson@example.com',
          phone: '(555) 789-0123',
        }
      },
      NationalID: 'EF345678',
      room: {
        roomID: '305', 
        room_type: 'suite',
        price: 170.00
      }, 
      check_in: '2024-03-19', 
      check_out: '2024-03-23', 
      num_of_nights: 4,
      total_price: 680.00,
      is_checked_in: false,
      is_checked_out: false,
      is_cancelled: false
    }
  ];

  const filteredCheckIns = expectedCheckIns.filter(reservation => 
    reservation.reservationID.toString().includes(searchTerm) ||
    reservation.guest.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.room.roomID.includes(searchTerm)
  );

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowGuestForm(true);
  };

  const getPaymentStatusClass = (reservation) => {
    // Determine payment status based on Django model
    // For demo purposes, using a simple logic
    if (reservation.payments && reservation.payments.length > 0) {
      const totalPaid = reservation.payments.reduce((sum, payment) => sum + payment.amount, 0);
      if (totalPaid >= reservation.total_price) {
        return 'bg-emerald-100 text-emerald-600';
      } else if (totalPaid > 0) {
        return 'bg-amber-100 text-amber-600';
      }
    }
    return 'bg-red-100 text-red-600';
  };

  const getPaymentStatusText = (reservation) => {
    // Determine payment status text based on Django model
    if (reservation.payments && reservation.payments.length > 0) {
      const totalPaid = reservation.payments.reduce((sum, payment) => sum + payment.amount, 0);
      if (totalPaid >= reservation.total_price) {
        return 'Paid';
      } else if (totalPaid > 0) {
        return 'Partial';
      }
    }
    return 'Unpaid';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Check In</h1>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                R
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {!showGuestForm ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Expected Check-ins</h2>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Search by reservation ID, guest name or room..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredCheckIns.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCheckIns.map((reservation) => (
                      <div 
                        key={reservation.reservationID}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-800">{reservation.guest.user.fullname}</h3>
                              <span className="text-amber-600 text-sm">RES-{reservation.reservationID}</span>
                            </div>
                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Room:</span> {reservation.room.roomID} ({reservation.room.room_type})
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Stay:</span> {new Date(reservation.check_in).toLocaleDateString()} to {new Date(reservation.check_out).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Total Nights:</span> {reservation.num_of_nights}
                              </div>
                              <div className="text-sm">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPaymentStatusClass(reservation)}`}>
                                  {getPaymentStatusText(reservation)} - ${reservation.total_price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSelectReservation(reservation)}
                            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors h-10"
                          >
                            <DoorOpen className="h-5 w-5" />
                            <span className="font-medium">Check In</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <p className="text-gray-800 mb-2">No reservations found matching your search.</p>
                    <p className="text-gray-500">Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Walk-in Check-in</h2>
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                  <p className="text-gray-800 mb-4">Need to check in a guest without a reservation?</p>
                  <button 
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                    onClick={() => setShowGuestForm(true)}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span className="font-medium">Create Walk-in Check-in</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedReservation ? `Check In: ${selectedReservation.guest.user.fullname}` : 'New Walk-in Check-in'}
                </h2>
                <button 
                  onClick={() => {
                    setShowGuestForm(false);
                    setSelectedReservation(null);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-amber-500" />
                      Guest Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Username</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.user.username || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.user.fullname || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.user.email || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.user.phone || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">National ID</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.NationalID || ''}
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
                        <label className="block text-sm text-gray-600 mb-1">Room ID</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.room.roomID || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Room Type</label>
                        <select 
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.room.room_type || ''}
                        >
                          <option value="standard">Standard</option>
                          <option value="deluxe">Deluxe</option>
                          <option value="suite">Suite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.check_in || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.check_out || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Number of Nights</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.num_of_nights || 1}
                        />
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
                        <button className="text-amber-600 text-sm flex items-center">
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add Companion
                        </button>
                      </div>
                      <div className="bg-white border border-gray-300 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <input
                            type="text"
                            placeholder="National ID"
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                      </div>
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
                        <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                        <select 
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="credit">Credit Card</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.total_price || ''}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Key className="h-5 w-5 mr-2 text-amber-500" />
                      Room Access
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="keycardIssued" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="keycardIssued" className="ml-2 text-sm text-gray-700">
                          Keycard Issued
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="doNotDisturb" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="doNotDisturb" className="ml-2 text-sm text-gray-700">
                          Do Not Disturb
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h3 className="font-medium text-amber-700 mb-3 flex items-center">
                      <ClipboardCheck className="h-5 w-5 mr-2" />
                      Check-in Checklist
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="idVerified" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="idVerified" className="ml-2 text-sm text-gray-700">
                          ID Verified
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="paymentCollected" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="paymentCollected" className="ml-2 text-sm text-gray-700">
                          Payment Collected
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="is_checked_in" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="is_checked_in" className="ml-2 text-sm text-gray-700">
                          Marked as Checked In
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setShowGuestForm(false);
                    setSelectedReservation(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Complete Check-in</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CheckInPage;