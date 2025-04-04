import React, { useState } from 'react';
import ReceptionistSidebar from './ReceptionistSideBar';
import { 
  DoorClosed,
  Search,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Star,
  ClipboardCheck,
  Users,
  X,
  AlertCircle,
  BedDouble,
  Receipt,
  BadgeCheck
} from 'lucide-react';

const CheckOutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // Sample data aligned with Django models
  const currentGuests = [
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
      check_in: '2024-03-17', 
      check_out: '2024-03-20', 
      num_of_nights: 3,
      total_price: 450.00,
      is_checked_in: true,
      is_checked_out: false,
      is_cancelled: false,
      services: [
        { serviceID: 'SRV001', type: 'roomservice', amount: 35.50, status: 'complete' },
        { serviceID: 'SRV002', type: 'laundry', amount: 25.00, status: 'complete' }
      ],
      payments: [
        { paymentID: 'PAY001', payment_method: 'credit', amount: 450.00, date: '2024-03-17' }
      ]
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
      check_in: '2024-03-18', 
      check_out: '2024-03-20', 
      num_of_nights: 2,
      total_price: 240.00,
      is_checked_in: true,
      is_checked_out: false,
      is_cancelled: false,
      services: [
        { serviceID: 'SRV003', type: 'maintenance', amount: 0.00, status: 'complete' }
      ],
      payments: [
        { paymentID: 'PAY002', payment_method: 'cash', amount: 240.00, date: '2024-03-18' }
      ]
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
      check_in: '2024-03-16', 
      check_out: '2024-03-20', 
      num_of_nights: 4,
      total_price: 680.00,
      is_checked_in: true,
      is_checked_out: false,
      is_cancelled: false,
      services: [
        { serviceID: 'SRV004', type: 'roomservice', amount: 52.25, status: 'complete' },
        { serviceID: 'SRV005', type: 'laundry', amount: 35.00, status: 'complete' },
        { serviceID: 'SRV006', type: 'roomservice', amount: 48.75, status: 'complete' }
      ],
      payments: [
        { paymentID: 'PAY003', payment_method: 'credit', amount: 680.00, date: '2024-03-16' }
      ]
    }
  ];

  const filteredGuests = currentGuests.filter(reservation => 
    reservation.reservationID.toString().includes(searchTerm) ||
    reservation.guest.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.room.roomID.includes(searchTerm)
  );

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowCheckoutForm(true);
  };

  const calculateTotalServiceCharges = (services) => {
    if (!services || services.length === 0) return 0;
    return services.reduce((total, service) => total + service.amount, 0);
  };

  const calculateTotalPayments = (payments) => {
    if (!payments || payments.length === 0) return 0;
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateRemainingBalance = (reservation) => {
    if (!reservation) return 0;
    
    const roomCharges = reservation.total_price;
    const serviceCharges = calculateTotalServiceCharges(reservation.services);
    const totalCharges = roomCharges + serviceCharges;
    
    const totalPaid = calculateTotalPayments(reservation.payments);
    
    return totalCharges - totalPaid;
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
            <h1 className="text-xl font-semibold text-gray-800">Check Out</h1>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium">
                R
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {!showCheckoutForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Guests</h2>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Search by reservation ID, guest name or room..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredGuests.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGuests.map((reservation) => (
                      <div 
                        key={reservation.reservationID}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-800">{reservation.guest.user.fullname}</h3>
                              <span className="text-amber-600 text-sm">RES-{reservation.reservationID}</span>
                            </div>
                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Room:</span> {reservation.room.roomID} ({reservation.room.room_type})
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Check-in:</span> {new Date(reservation.check_in).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Check-out:</span> {new Date(reservation.check_out).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="text-gray-800">Nights:</span> {reservation.num_of_nights}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              {reservation.services && reservation.services.length > 0 && (
                                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {reservation.services.length} Service{reservation.services.length !== 1 ? 's' : ''}
                                </div>
                              )}
                              
                              {calculateRemainingBalance(reservation) > 0 ? (
                                <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  ${calculateRemainingBalance(reservation).toFixed(2)} Balance Due
                                </div>
                              ) : (
                                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                                  Fully Paid
                                </div>
                              )}
                              
                              <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                ${reservation.total_price.toFixed(2)} Room Total
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSelectReservation(reservation)}
                            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors h-10"
                          >
                            <DoorClosed className="h-5 w-5" />
                            <span className="font-medium">Check Out</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <p className="text-gray-700 mb-2">No guests found matching your search.</p>
                    <p className="text-gray-500">Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedReservation ? `Check Out: ${selectedReservation.guest.user.fullname}` : ''}
                </h2>
                <button 
                  onClick={() => {
                    setShowCheckoutForm(false);
                    setSelectedReservation(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
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
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.guest.user.fullname}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.guest.user.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.guest.user.phone}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">National ID</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.NationalID}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <BedDouble className="h-5 w-5 mr-2 text-amber-500" />
                      Stay Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Room</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.room.roomID} ({selectedReservation?.room.room_type})
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation ? new Date(selectedReservation.check_in).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation ? new Date(selectedReservation.check_out).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Number of Nights</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.num_of_nights}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Clipboard className="h-5 w-5 mr-2 text-amber-500" />
                      Service Charges
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-gray-700">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-4 py-2">Service ID</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReservation?.services && selectedReservation.services.length > 0 ? (
                            selectedReservation.services.map((service) => (
                              <tr key={service.serviceID} className="border-b border-gray-200">
                                <td className="px-4 py-2">{service.serviceID}</td>
                                <td className="px-4 py-2 capitalize">{service.type}</td>
                                <td className="px-4 py-2">${service.amount.toFixed(2)}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    service.status === 'complete' 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : service.status === 'in_progress'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {service.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-4 py-2 text-center text-gray-500">No services used during stay</td>
                            </tr>
                          )}
                          <tr className="bg-gray-50">
                            <td colSpan="2" className="px-4 py-2 font-medium">Total Service Charges</td>
                            <td colSpan="2" className="px-4 py-2 font-medium">
                              ${selectedReservation ? calculateTotalServiceCharges(selectedReservation.services).toFixed(2) : '0.00'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-amber-500" />
                      Guest Feedback
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Overall Rating</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button 
                              key={rating}
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-white border border-gray-300 hover:bg-amber-100 text-gray-500 hover:text-amber-500"
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Comments</label>
                        <textarea
                          placeholder="Ask guest for any feedback about their stay..."
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent h-24"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Receipt className="h-5 w-5 mr-2 text-amber-500" />
                      Bill Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Room Charges</span>
                        <span className="text-gray-800">${selectedReservation?.total_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Service Charges</span>
                        <span className="text-gray-800">
                          ${selectedReservation ? calculateTotalServiceCharges(selectedReservation.services).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">
                          ${selectedReservation ? 
                            (selectedReservation.total_price + calculateTotalServiceCharges(selectedReservation.services)).toFixed(2) 
                            : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Amount Paid</span>
                        <span className="text-gray-800">
                          ${selectedReservation ? calculateTotalPayments(selectedReservation.payments).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 font-medium">
                        <span className="text-gray-800">Balance Due</span>
                        <span className={`${calculateRemainingBalance(selectedReservation) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          ${Math.abs(calculateRemainingBalance(selectedReservation)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {calculateRemainingBalance(selectedReservation) > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
                      <h3 className="font-medium text-red-700 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Outstanding Balance
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        The guest has an outstanding balance of ${calculateRemainingBalance(selectedReservation).toFixed(2)} that needs to be settled before check-out.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                          <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
                            <option value="credit">Credit Card</option>
                            <option value="cash">Cash</option>
                          </select>
                        </div>
                        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                          <CreditCard className="h-5 w-5" />
                          <span>Process Payment</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-amber-700 mb-3 flex items-center">
                      <ClipboardCheck className="h-5 w-5 mr-2" />
                      Check-out Checklist
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="roomInspected" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="roomInspected" className="ml-2 text-sm text-gray-700">
                          Room Inspected
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="minibarChecked" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="minibarChecked" className="ml-2 text-sm text-gray-700">
                          Mini-bar Checked
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="keyReturned" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="keyReturned" className="ml-2 text-sm text-gray-700">
                          Keycard Returned
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="billSettled" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                          checked={calculateRemainingBalance(selectedReservation) <= 0}
                          readOnly
                        />
                        <label htmlFor="billSettled" className="ml-2 text-sm text-gray-700">
                          Bill Settled
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="is_checked_out" 
                          className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-400"
                        />
                        <label htmlFor="is_checked_out" className="ml-2 text-sm text-gray-700">
                          Marked as Checked Out
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setShowCheckoutForm(false);
                    setSelectedReservation(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className={`px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors ${
                    calculateRemainingBalance(selectedReservation) > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={calculateRemainingBalance(selectedReservation) > 0}
                >
                  <BadgeCheck className="h-5 w-5" />
                  <span>Complete Check-out</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CheckOutPage;