import React, { forwardRef } from 'react';
import { Receipt, Phone, Mail, MapPin } from 'lucide-react';

const HotelInvoice = forwardRef(({ reservation }, ref) => {
  if (!reservation) return null;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const invoiceNumber = `INV-${reservation.reservationID}-${new Date().toISOString().slice(0,10)}`;
  
  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-gray-600 mt-1">Invoice #: {invoiceNumber}</p>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-amber-600">NOVOTEL HOTEL</h2>
          <div className="flex items-center justify-end mt-1">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-gray-600">123 Luxury Avenue, Cityville</p>
          </div>
          <div className="flex items-center justify-end mt-1">
            <Phone className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-gray-600">(555) 123-4567</p>
          </div>
          <div className="flex items-center justify-end mt-1">
            <Mail className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-gray-600">contact@novotel.com</p>
          </div>
        </div>
      </div>
      
      {/* Guest Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Guest Information</h2>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <p className="text-gray-600">Name: <span className="text-gray-800">{reservation.guest.fullname}</span></p>
            <p className="text-gray-600">Email: <span className="text-gray-800">{reservation.guest.email}</span></p>
          </div>
          <div>
            <p className="text-gray-600">Phone: <span className="text-gray-800">{reservation.guest.phone}</span></p>
            <p className="text-gray-600">ID: <span className="text-gray-800">{reservation.NationalID}</span></p>
          </div>
        </div>
      </div>
      
      {/* Reservation Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Reservation Details</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Room Number</p>
              <p className="text-gray-800 font-medium">{reservation.room.roomID}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Room Type</p>
              <p className="text-gray-800 font-medium">{reservation.room.room_type}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Check-in</p>
              <p className="text-gray-800 font-medium">{formatDate(reservation.check_in)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Check-out</p>
              <p className="text-gray-800 font-medium">{formatDate(reservation.check_out)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Number of Nights</p>
              <p className="text-gray-800 font-medium">{reservation.num_of_nights}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Room Rate</p>
              <p className="text-gray-800 font-medium">{(reservation.total_price / reservation.num_of_nights).toFixed(2)}/night  DZD</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charges */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Charges</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Description</th>
              <th className="py-2 px-4 text-right text-gray-600 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-800">Room Charges ({reservation.num_of_nights} nights)</td>
              <td className="py-3 px-4 text-right text-gray-800">{parseFloat(reservation.total_price).toFixed(2)} DZD</td>
            </tr>
            
            {/* Services */}
            {reservation.services && reservation.services.map((service, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-800">{service.type}</td>
                <td className="py-3 px-4 text-right text-gray-800">{parseFloat(service.amount).toFixed(2)} DZD</td>
              </tr>
            ))}
            
            {/* Total */}
            <tr className="bg-gray-50">
              <td className="py-3 px-4 text-gray-800 font-semibold">Total Charges</td>
              <td className="py-3 px-4 text-right text-gray-800 font-semibold">
                {(parseFloat(reservation.total_price) + 
                   (reservation.services ? reservation.services.reduce((sum, service) => sum + parseFloat(service.amount || 0), 0) : 0)).toFixed(2)} DZD
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Payments */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Payments</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Date</th>
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Method</th>
              <th className="py-2 px-4 text-right text-gray-600 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {reservation.payments && reservation.payments.map((payment, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-800">{formatDate(payment.date)}</td>
                <td className="py-3 px-4 text-gray-800 capitalize">{payment.method}</td>
                <td className="py-3 px-4 text-right text-gray-800">{parseFloat(payment.amount).toFixed(2)} DZD</td>
              </tr>
            ))}
            
            {/* Total Paid */}
            <tr className="bg-gray-50">
              <td colSpan="2" className="py-3 px-4 text-gray-800 font-semibold">Total Paid</td>
              <td className="py-3 px-4 text-right text-green-700 text-xl font-bold">
                {reservation.payments ? reservation.payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0).toFixed(2) : '0.00'} DZD
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Balance */}

      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-2">Thank you for choosing Novotel Hotel!</p>
        <p className="text-gray-500 text-sm">For any inquiries regarding this invoice, please contact our billing department.</p>
      </div>
    </div>
  );
});

export default HotelInvoice;