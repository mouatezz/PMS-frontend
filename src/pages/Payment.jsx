import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, getMonth, getYear } from 'date-fns';
import Sidebar from '../components/SideBar';
import DataTable from '../components/DataTable';
import api from '../api';

const PaymentTotalsPopup = ({ isOpen, onClose, payments }) => {
  if (!isOpen) return null;

  // Calculate totals by month and year
  const calculateTotalsByMonthYear = () => {
    const totals = {};
    
    payments.forEach(payment => {
      if (!payment.date) return;
      
      const date = parseISO(payment.date);
      const year = getYear(date);
      const month = getMonth(date);
      
      const key = `${year}-${month}`;
      
      if (!totals[key]) {
        totals[key] = {
          year,
          month,
          monthName: format(date, 'MMMM'),
          total: 0
        };
      }
      
      totals[key].total += parseFloat(payment.amount || 0);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.values(totals).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  const monthlyTotals = calculateTotalsByMonthYear();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Monthly Income Totals</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Year</th>
                <th className="py-2 px-4 text-left">Month</th>
                <th className="py-2 px-4 text-right">Total Income (DA)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTotals.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3 px-4">{item.year}</td>
                  <td className="py-3 px-4">{item.monthName}</td>
                  <td className="py-3 px-4 text-right text-green-400 font-medium">
                    {item.total} DA
                  </td>
                </tr>
              ))}
              {monthlyTotals.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    No payment data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const [payments, setPayments] = useState([
    {
      reservationID: '0', 
      guest: 'loading...',
      amount: 0,
      payment_method: 'loading...',
      date: '2023-10-01'
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [showTotalsPopup, setShowTotalsPopup] = useState(false);

  const paymentColumns = [
    { 
      key: 'reservationID', 
      header: 'Reservation ID', 
      sortable: true,
      cellClassName: 'text-amber-300' 
    },
    { 
      key: 'type', 
      header: 'billing type',
      cellClassName: 'text-white' 
    },
    { 
      key: 'amount', 
      header: 'Amount (DA)',
      sortable: true,
      cellClassName: 'text-green-400' 
    },
    { 
      key: 'payment_method', 
      header: 'Method',
      cellClassName: 'text-white' 
    },
    { 
      key: 'date', 
      header: 'Date',
      sortable: true,
      cellClassName: 'text-white' 
    }
  ];
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('backend/hotel_admin/payment/');
        console.log(response.data);
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        !searchTerm || 
        payment.reservationID?.toString().includes(searchTerm) ||
        payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!payment.date) return matchesSearch;
      
      const paymentDate = parseISO(payment.date);
      const matchesDateRange = 
        (!dateFilter.startDate || paymentDate >= parseISO(dateFilter.startDate)) &&
        (!dateFilter.endDate || paymentDate <= parseISO(dateFilter.endDate));
      
      return matchesSearch && matchesDateRange;
    });
  }, [payments, searchTerm, dateFilter]);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTotal = useMemo(() => {
    return payments
      .filter(payment => {
        if (!payment.date) return false;
        const paymentDate = parseISO(payment.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
  }, [payments, currentMonth, currentYear]);

  const getTotalGain = (month, year) => {
    return payments
      .filter(payment => {
        if (!payment.date) return false;
        const paymentDate = parseISO(payment.date);
        return (
          paymentDate.getMonth() === month &&
          paymentDate.getFullYear() === year
        );
      })
      .reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex-row">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex-col items-center mb-6">
            <h1 className="text-2xl font-medium text-white">Incomes</h1>
            <p className="ml-2 mt-2 font-thin text-gray-400">informations</p>
          </div>

          <div className="mb-6 ml-6 flex items-start justify-between">
            <div className="flex flex-row items-center">
              <h2 className="text-white font-normal">Monthly Total Gain:</h2>
              <span className="text-green-400 font-bold ml-6">{currentMonthTotal} DA</span>
            </div>
            
            <button 
              onClick={() => setShowTotalsPopup(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Monthly Totals
            </button>
          </div>
          
          {/* Filtering Section */}
          <div className="bg-gray-800 rounded-md p-4 mb-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              {/* Search Input */}
              <input 
                type="text" 
                placeholder="Search by guest, reservation ID, or method" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Start Date Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-white">From:</label>
                <input 
                  type="date" 
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({
                    ...prev, 
                    startDate: e.target.value
                  }))}
                  className="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* End Date Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-white">To:</label>
                <input 
                  type="date" 
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({
                    ...prev, 
                    endDate: e.target.value
                  }))}
                  className="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-medium">Recent Payment</h2>
              <span className="text-gray-400">
                {filteredPayments.length} payments
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-4 text-gray-400">Loading payments...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-400">Error loading payments: {error.message}</div>
            ) : (
              <DataTable 
                data={filteredPayments} 
                columns={paymentColumns}
              />
            )}
          </div>
        </main>
      </div>
      
      <PaymentTotalsPopup 
        isOpen={showTotalsPopup} 
        onClose={() => setShowTotalsPopup(false)} 
        payments={payments} 
      />
    </div>
  );
};

export default Payment;