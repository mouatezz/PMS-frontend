import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correct import for the latest version

const QRCodePopup = ({ reservationId, username, roomId, onClose , onClose2 }) => {
  const generateQRCodeData = () => {
    return JSON.stringify({
      reservationId,
      username,
      roomId,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center ">
          
          <button
            onClick={() => {
              onClose();
              onClose2();
            }}
            
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-col justify-center ">
        <h3 className="text-lg font-medium text-center">Guest room access QRCode</h3>
          <QRCodeSVG 
            value={generateQRCodeData()}
            size={400}
            level="H"
            includeMargin={true}
          /> 
        </div>
        reseravation: RES-{reservationId}<br />
        guest: {username} <br />
        room number : ROOM-{roomId}
        
       
      </div>
    </div>
  );
};

export default QRCodePopup;