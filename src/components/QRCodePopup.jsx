import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePopup = ({ reservationId, onClose, onClose2 }) => {
  const generateQRCodeData = () => {
    return JSON.stringify({
      reservationId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Digital Access Pass</h2>
          <button
            onClick={() => {
              onClose();
              onClose2();
            }}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-extrabold text-blue-700 leading-tight">
              Scan QR Code for Ultimate Access
            </h1>
            <p className="text-lg text-gray-600">
              Unlock all hotel services and amenities with one simple scan.
            </p>
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-2">Or enter reservation code manually:</p>
              <p className="text-lg">
                Reservation: <span className="font-bold text-blue-600">RES-{reservationId}</span>
              </p>
             
            </div>
          </div>

          {/* Right Column */}
            <div className="  flex justify-center items-center">
              <QRCodeSVG
                value={generateQRCodeData()}
                size={400}
                level="H"
                includeMargin={true}
              />
            </div>
          
        </div>

      </div>
    </div>
  );
};

export default QRCodePopup;