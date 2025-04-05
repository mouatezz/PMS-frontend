import React, { useState , useEffect } from 'react';
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
import api from '../../api';
import { data } from 'react-router-dom';
import { set } from 'date-fns';
const CheckInPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pay, setPay] = useState(false);
  const [payment, setPayment] = useState([{
    amount: 0,
    type: "stay",
    payment_method: "cash",
  }]);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expectedCheckIns , setexpectedCheckIns] = useState([])

    const [companions, setCompanions] = useState([
    ]);
  
    const addCompanion = () => {
      setCompanions([...companions, { fullName: '', NationalID: '', phoneNumber: '' }]);
    };
  
    const handleInputChange = (index, field, value) => {
      const updatedCompanions = [...companions];
      updatedCompanions[index][field] = value;
      setCompanions(updatedCompanions);
    };

    const handleCheckIn = async (reservationID) => {
      try {
        const data = {
          reservationID,
          room: selectedReservation.room.roomID,
          guest: selectedReservation.guest.username,
          companions: companions.map((companion) => ({
            fullname: companion.fullName,
            NationalID: companion.NationalID,
            phone: companion.phoneNumber,
          })),
          payment: pay ? payment : [], 
        };
        console.log(data);
        const response = await api.post(`/backend/hotel_admin/checkins/`, data);
        console.log(response.data);
        setShowGuestForm(false);
        setPay(false);
        setPayment({
          amount: 0,
          type: "stay",
          payment_method: "cash",
        });
        fetchReservations();
         console.log(data);
  
      } catch (error) {
        console.error('Error during check-in:', error);
      }
    };
    const fetchReservations = async () => {
      try {
        const response = await api.get('/backend/hotel_admin/checkins/');
        console.log(response.data);
        setexpectedCheckIns(response.data);
      } catch (err) {
        console.error(err);
      }
    }

  useEffect(() => {

      
    fetchReservations();
  }, []);

  

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex">
      <ReceptionistSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 md:ml-64">
        <header className=" p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Check-In page</h1>
           
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
                              <h3 className="text-lg font-medium text-gray-800">{reservation.guest.fullname}</h3>
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
                                  {getPaymentStatusText(reservation)} - {reservation.total_price} DA
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
                    <p className="text-gray-800 mb-2">No upcoming checkins for today.</p>
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
                  {selectedReservation ? `Check In: ${selectedReservation.guest.fullname}` : 'New Walk-in Check-in'}
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
                          defaultValue={selectedReservation?.guest.username || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.fullname || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.email || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          defaultValue={selectedReservation?.guest.phone || ''}
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
                        <div
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          
                        > {selectedReservation?.check_in.split('T')[0]}
                      </div> </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
                        <div
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          
                        >
                        {selectedReservation?.check_out.split('T')[0] || ''}
                      </div> </div>
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
                    <div className=" space-y-4">
                      
                      <div>
                      <label className="block text-sm text-gray-600 mb-1">Stay Amount</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        defaultValue={selectedReservation?.total_price || ''}
                        
                      />
                      </div>
                      {!pay && (
                           <div className='flex justify-end'> 
                           <button className='bg-amber-50 rounded-lg p-2 border  border-amber-200 text-amber-700'
                           onClick={() => {
                             setPay(true);
                             setPayment({ ...payment, amount: selectedReservation?.total_price });
                           }}> pay now ?
                            
                           </button>
                           </div>  
                      )}
                      {pay && (
                       <div>
                       <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                       <select 
                         className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                         
                          onChange={(e) => setPayment({ ...payment, payment_method: e.target.value })}
                       >
                        <option value="cash">Cash</option>
                         <option value="credit">Credit Card</option>
                         
                         
                       </select>
                     </div>
                      )}
                      
                  
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
                    setPay(false);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors"
                  onClick ={() => {
                    handleCheckIn(selectedReservation.reservationID) ;
                    
                  }}
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