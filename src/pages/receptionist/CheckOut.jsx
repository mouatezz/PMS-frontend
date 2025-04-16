import React, { useState , useEffect ,useRef } from 'react';
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
  X,Mail, Printer,
  AlertCircle,
  BedDouble,
  Receipt,
  BadgeCheck
} from 'lucide-react';
import api from '../../api.js';

import HotelInvoice from './Hotelinvoice'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const CheckOutPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentGuests, setcurrentguests] = useState([
    { 
      reservationID: 1, 
      guest: {
          username: 'loading...',
          fullname: 'loading...',
          email: 'loading...',
          phone: 'loading...',
        
      },
      NationalID: 'loading...',
      room: {
        roomID: 'loading...', 
        room_type: 'loading...',
        price: 0
      },
      check_in: '2024-03-17', 
      check_out: '2024-03-20', 
      num_of_nights: 0,
      total_price: 0,
      is_checked_in: true,
      is_checked_out: false,
      is_cancelled: false,
      services: [
        {
          serviceID: 1,
          type: 'Room Service',
          amount: 50.00,
          status: 'complete'
        }
      ],
      payments: [
        {
          paymentID: 1,
          amount: 100.00,
          method: 'credit_card',
          date: '2024-03-17'
        }
      ]
    },
   
   
  ]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const invoiceRef = useRef(null);
  const [CheckOutInfos , setCheckOutInfos]=useState({
    reservationID: null,
    total_price: 0,
    guest: '',
    room: '',
    payment : {
      reservationID: null,
      method: 'cash',
      amount: 0,
      type: 'service',
    },
    rating: 0,
    comments: '',
  });

  
const fetchReservations = async () => {
  try{
  const response = await api.get('backend/receptionist/checkouts/');
  console.log(response.data);
    setcurrentguests(response.data);
  
  }catch(e){
    console.error(e);
  }

}
const processPayment = async () => {
   console.log(CheckOutInfos);
   
    
   try {
    if(CheckOutInfos.payment.method === 'cash'){
    const response = await api.post('backend/receptionist/payment/', {
      "amount" : CheckOutInfos.payment.amount,
      "payment_method" : CheckOutInfos.payment.method,
      "type" : CheckOutInfos.payment.type,
      "reservationID" : selectedReservation.reservationID,
   });
   console.log(response.data);
  }else {
    console.log('payment method is card ');
    const response = await api.post('backend/receptionist/chargily/', {
      "amount" : CheckOutInfos.payment.amount,
      "payment_method" : CheckOutInfos.payment.method,
      "type" : CheckOutInfos.payment.type,
      "reservationID" : selectedReservation.reservationID,
      "fullname": selectedReservation.guest.fullname ,
      "email": selectedReservation.guest.email
   })
       console.log(response.data);
  }
    
   const reservationsResponse = await api.get('backend/receptionist/checkouts/');
   setcurrentguests(reservationsResponse.data);
   
   const updatedReservation = reservationsResponse.data.find(
     res => res.reservationID === selectedReservation.reservationID
   );
   
   if (updatedReservation) {
     setSelectedReservation(updatedReservation);
   }
    
     (response.status === 200) 
    
  } catch (error) {
    console.error('Error processing payment:', error);
  }
};

const processCheckOut = async () => {
  try { 
    console.log(`checking out RES${selectedReservation.reservationID}........`);
    const response = await api.post('backend/receptionist/checkouts/', {"reservationID" :selectedReservation.reservationID});
    console.log(response.data);
    fetchReservations();
    
  } catch (error) {
    console.error('Error processing payment:', error);
  }
  
};
const generatePDF = async () => {
  if (!invoiceRef.current) return;
  
  try {
    setEmailStatus('Generating PDF...');
    
    // Use a lower scale factor for smaller file size
    const canvas = await html2canvas(invoiceRef.current, { 
      scale: 1.5,  // Reduced from 2 to 1.5
      useCORS: true,
      logging: false, // Disable logging
      imageTimeout: 0 // No timeout for images
    });
    
    // Reduce image quality
    const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality instead of PNG
    
    // A4 size: 210 x 297 mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio, null, 'FAST');
    
    // Use compression options available in jsPDF
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    setEmailStatus('Error generating PDF');
  }
};
const InvoiceByEmail1 = async () => {
  if (!emailTo) {
    setEmailStatus('Please enter a valid email address');
    return;
  }
  
  try {
    setEmailStatus('Preparing invoice...');
    const pdfBlob = await generatePDF();
    if (!pdfBlob) {
      setEmailStatus('Failed to generate invoice');
      return;
    }
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('email', emailTo);
    formData.append('subject', `Invoice for Reservation #${selectedReservation.reservationID}`);
    formData.append('message', `Thank you for staying at NOVOTEL Hotel. Please find attached your invoice.`);
    formData.append('attachment', pdfBlob, `invoice-${selectedReservation.reservationID}.pdf`);
    
    setEmailStatus('Sending email...');

    // Debugging the attachment
    console.log('Attachment:', formData.get('attachment'));
    console.log('Attachment Name:', formData.get('attachment').name);
    console.log('Attachment Type:', formData.get('attachment').type);
    const response = await api.post('backend/receptionist/send-invoice-email/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.status === 200) {
      setEmailStatus('Invoice sent successfully!');
      setTimeout(() => {
        setShowInvoice(false);
        setShowCheckoutForm(false);
        setSelectedReservation(null);
      }, 3000);
    } else {
      setEmailStatus('Failed to send email. Please try again.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    setEmailStatus('Error sending email: ' + (error.message || 'Unknown error'));
  }
};


const sendInvoiceByEmail = async () => {
  if (!emailTo) {
    setEmailStatus('Please enter a valid email address');
    return;
  }
  
  try {
    setEmailStatus('Preparing invoice...');
    const pdfBlob = await generatePDF();
    if (!pdfBlob) {
      setEmailStatus('Failed to generate invoice');
      return;
    }
    
    // Compress PDF using pdf-lib (install with: npm install pdf-lib)
    setEmailStatus('Compressing invoice...');
    
    // Read the PDF as an ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Import the pdf-lib library
    const { PDFDocument } = await import('pdf-lib');
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Serialize with compression options
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addCompression: true
    });
    
    // Convert compressed bytes to Blob
    const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    
    // Log sizes for comparison
    console.log('Original size:', pdfBlob.size, 'bytes');
    console.log('Compressed size:', compressedPdfBlob.size, 'bytes');
    
    // Create form data with proper Content-Type
    const formData = new FormData();
    formData.append('email', emailTo);
    formData.append('subject', `Invoice for Reservation #${selectedReservation.reservationID}`);
    formData.append('message', `Thank you for staying at NOVOTEL Hotel. Please find attached your invoice.`);
    
    // Use the compressed PDF for the email
    const file = new File([compressedPdfBlob], `invoice-${selectedReservation.reservationID}.pdf`, {
      type: 'application/pdf',
    });
    formData.append('attachment', file);
    
    setEmailStatus('Sending email...');
    
    // If the file is still too large, inform the user
    if (file.size > 5 * 1024 * 1024) {
      setEmailStatus(`File is still too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 5MB.`);
      return;
    }
    
    const response = await api.post('backend/receptionist/send-invoice-email/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.status === 200) {
      setEmailStatus('Invoice sent successfully!');
      // After successful email, you might want to close the forms
      setTimeout(() => {
        setShowInvoice(false);
        setShowCheckoutForm(false);
        setSelectedReservation(null);
      }, 3000);
    } else {
      setEmailStatus('Failed to send email. Please try again.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    setEmailStatus('Error sending email: ' + (error.message || 'Unknown error'));
  }
};

useEffect(() => {
  setEmailTo(selectedReservation?.guest.email);
  fetchReservations();
  
  setCheckOutInfos({
    ...CheckOutInfos,
    payment: {
      ...CheckOutInfos.payment,
      amount: calculateRemainingBalance(selectedReservation),
    },
  });
  
}
, [selectedReservation]);
  const filteredGuests = currentGuests.filter(reservation => 
    reservation.reservationID.toString().includes(searchTerm) ||
    reservation.guest.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.room.roomID.includes(searchTerm)
  );

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowCheckoutForm(true);
  };

  const calculateTotalServiceCharges = (services) => {
    if (!services || services.length === 0) return 0;
    return services.reduce((total, service) => total + parseFloat(service.amount || 0), 0);
  };

  const calculateTotalPayments = (payments) => {
    if (!payments || payments.length === 0) return 0;
    return payments.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
  };

  const calculateRemainingBalance = (reservation) => {
    if (!reservation) return 0;
    
    const roomCharges = parseFloat(reservation.total_price || 0);
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
                              <h3 className="text-lg font-medium text-gray-800">{reservation.guest.fullname}</h3>
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
                                ${parseFloat(reservation.total_price || 0).toFixed(2)} Room Total
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
             ) : showInvoice ? (
              // Invoice view
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Invoice for {selectedReservation?.guest.fullname}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowInvoice(false);
                      setShowCheckoutForm(false);
                      setSelectedReservation(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* The invoice component */}
                <div className="mb-6 border border-gray-200 rounded-lg">
                  <HotelInvoice 
                    reservation={selectedReservation} 
                    ref={invoiceRef}
                  />
                </div>
                
                {/* Email and print options */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Send Invoice</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={selectedReservation?.guest.email}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                    
                    {emailStatus && (
                      <div className={`p-2 rounded ${
                        emailStatus.includes('success') ? 'bg-green-50 text-green-700' : 
                        emailStatus.includes('Error') ? 'bg-red-50 text-red-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {emailStatus}
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={sendInvoiceByEmail}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span>Send by Email</span>
                      </button>
                      
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowInvoice(false);
                      setShowCheckoutForm(false);
                      setSelectedReservation(null);
                    }}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedReservation ? `Check Out: ${selectedReservation.guest.fullname}` : ''}
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
                          {selectedReservation?.guest.fullname}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.guest.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                          {selectedReservation?.guest.phone}
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
                                <td className="px-4 py-2">${parseFloat(service.amount || 0).toFixed(2)}</td>
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
                        <span className="text-gray-800">${parseFloat(selectedReservation?.total_price || 0).toFixed(2)}</span>
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
                            (parseFloat(selectedReservation.total_price || 0) + calculateTotalServiceCharges(selectedReservation.services)).toFixed(2) 
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
                          <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            onChange={(e) => setCheckOutInfos({ ...CheckOutInfos, payment: { ...CheckOutInfos.payment, method: e.target.value } })}>
                            <option value="cash">Cash</option>
                            <option value="credit">Credit Card</option>
                            
                          </select>
                        </div>
                        <button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                    onClick={() => { processPayment(); }}
                                  >
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
                  onClick={() => {
                    setShowInvoice(true);
                    processCheckOut();
                  }}
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