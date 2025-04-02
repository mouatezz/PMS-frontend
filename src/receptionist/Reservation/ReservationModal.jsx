import React from 'react';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  currentReservation, 
  formData, 
  handleInputChange, 
  companionData, 
  handleCompanionInputChange, 
  addCompanion, 
  removeCompanion, 
  handleSubmit, 
  rooms, 
  guests 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {currentReservation ? 'Edit Reservation' : 'New Reservation'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-1">Guest</label>
              <select
                name="guest"
                value={formData.guest}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Guest</option>
                {guests.map((guest) => (
                  <option key={guest.user.username} value={guest.user.username}>
                    {guest.user.fullname}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">National ID</label>
              <input
                type="text"
                name="NationalID"
                value={formData.NationalID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Room</label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Room</option>
                {rooms.map((room) => (
                  <option key={room.roomID} value={room.roomID} disabled={room.is_occupied && !currentReservation?.room?.roomID === room.roomID}>
                    {room.roomID} - {room.room_type} (${room.price}/night)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Check-in Date & Time</label>
              <input
                type="datetime-local"
                name="check_in"
                value={formData.check_in}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Check-out Date & Time</label>
              <input
                type="datetime-local"
                name="check_out"
                value={formData.check_out}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Number of Nights</label>
              <input
                type="number"
                name="num_of_nights"
                value={formData.num_of_nights}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Total Price</label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_checked_in"
                  name="is_checked_in"
                  checked={formData.is_checked_in}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="is_checked_in" className="text-gray-300">Checked In</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_checked_out"
                  name="is_checked_out"
                  checked={formData.is_checked_out}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="is_checked_out" className="text-gray-300">Checked Out</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_cancelled"
                  name="is_cancelled"
                  checked={formData.is_cancelled}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="is_cancelled" className="text-gray-300">Cancelled</label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Companions</h3>
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={companionData.fullname}
                    onChange={handleCompanionInputChange}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">National ID</label>
                  <input
                    type="text"
                    name="NationalID"
                    value={companionData.NationalID}
                    onChange={handleCompanionInputChange}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={companionData.phone}
                    onChange={handleCompanionInputChange}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addCompanion}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition duration-200"
              >
                Add Companion
              </button>
              
              {formData.companions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-300 mb-2">Added Companions</h4>
                  <div className="space-y-2">
                    {formData.companions.map((companion, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded-md">
                        <div>
                          <span className="text-white">{companion.fullname}</span>
                          <span className="text-gray-400 ml-2">ID: {companion.NationalID}</span>
                          <span className="text-gray-400 ml-2">{companion.phone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCompanion(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
            >
              {currentReservation ? 'Update' : 'Create'} Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;