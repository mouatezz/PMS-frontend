import React from 'react';
import { CheckCircle, XCircle, Edit, Trash, Clock } from 'lucide-react';

const ReservationTable = ({ 
  filteredReservations, 
  handleCheckIn, 
  handleCheckOut, 
  handleEditReservation, 
  handleDeleteReservation 
}) => {
  const getStatusBadge = (reservation) => {
    if (reservation.is_cancelled) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Cancelled</span>;
    } else if (reservation.is_checked_out) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Checked Out</span>;
    } else if (reservation.is_checked_in) {
      return <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">Checked In</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">Upcoming</span>;
    }
  };

  return (
    <div className="space-y-4">
      {filteredReservations.length > 0 ? (
        filteredReservations.map((reservation) => (
          <div 
            key={reservation.reservationID}
            className="bg-gray-700/50 hover:bg-gray-700 transition-colors rounded-lg p-4"
          >
            <div className="flex justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-white">{reservation.guest.user.fullname}</h3>
                  <span className="text-amber-300 text-sm">RES-{reservation.reservationID}</span>
                </div>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="text-sm text-gray-400">
                    <span className="text-white">Room:</span> {reservation.room.roomID} ({reservation.room.room_type})
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-white">Stay:</span> {new Date(reservation.check_in).toLocaleDateString()} to {new Date(reservation.check_out).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-white">Total Nights:</span> {reservation.num_of_nights}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-white">Payment:</span> ${reservation.total_price.toFixed(2)}
                    {reservation.payments?.length > 0 ? (
                      <span className="ml-2 text-emerald-400 flex items-center inline-flex">
                        <CheckCircle size={12} className="mr-1" />Paid
                      </span>
                    ) : (
                      <span className="ml-2 text-amber-400 flex items-center inline-flex">
                        <Clock size={12} className="mr-1" />Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  {getStatusBadge(reservation)}
                  {reservation.guest_companions.length > 0 && (
                    <span className="ml-2 text-xs text-amber-400">+{reservation.guest_companions.length} companions</span>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                {!reservation.is_checked_in && !reservation.is_cancelled && (
                  <button 
                    onClick={() => handleCheckIn(reservation.reservationID)}
                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                    title="Check In"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {reservation.is_checked_in && !reservation.is_checked_out && (
                  <button 
                    onClick={() => handleCheckOut(reservation.reservationID)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Check Out"
                  >
                    <XCircle size={18} />
                  </button>
                )}
                <button 
                  onClick={() => handleEditReservation(reservation)}
                  className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteReservation(reservation.reservationID)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <p className="text-white mb-2">No reservations found matching your search.</p>
          <p className="text-gray-400">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ReservationTable;