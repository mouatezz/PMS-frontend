import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Filter, CheckCircle2, X, AlertCircle, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import Sidebar from '../../components/SideBar';
import DataTable from '../../components/DataTable';
import api from '../../api';

const TimeOffRequestsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  
  // Response modal state
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState({ action: '', note: '' });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      case 'pending':
      default:
        return 'bg-amber-300/20 text-amber-300';
    }
  };

  useEffect(() => {
    fetchTimeOffRequests();
  }, []);

  const fetchTimeOffRequests = async () => {
    try {
      console.log('Fetching time off requests...');
      setLoading(true);
      const response = await api.get('/backend/hotel_admin/timeoff/' ,  {
        headers: {
          'Content-Type': 'application/json',
          $bearer: localStorage.getItem('access_token')
        }
      });
      console.log('Time off requests:', response.data);
      setTimeOffRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch time off requests:', err);
      setError('Failed to fetch time off requests');
      setLoading(false);
    }
  };

  const handleResponseClick = (request) => {
    setSelectedRequest(request);
    setResponseModalOpen(true);
    setResponse({ action: '', note: '' });
  };

  const handleResponseSubmit = async () => {
    if (!selectedRequest || !response.action) return;
    
    setIsProcessing(true);
    try {
      console.log('Submitting response:', selectedRequest.id ,response.action);
      const apiResponse = await api.post('backend/hotel_admin/timeoff/', {
        id: selectedRequest.id,
        action: response.action === 'approve' ? 'Approved' : 'Rejected',

      } , {
        headers: {
          'Content-Type': 'application/json',
          $bearer: localStorage.getItem('access_token')
        }
      });
console.log('Response:', apiResponse.data);
     
      
      setResponseModalOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Failed to update time off request:', err);
      setError('Failed to update time off request');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  const filteredRequests = timeOffRequests.filter(request => {
    const searchQueryLower = searchQuery.toLowerCase();
    const staffName = request.staff?.toLowerCase() || '';
    const reason = request.reason?.toLowerCase() || '';
    
    const matchesSearch = 
      staffName.includes(searchQueryLower) ||
      reason.includes(searchQueryLower);
    
    const matchesStatus = filterStatus === 'All' || request.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'staff',
      header: 'Staff Name',
      renderCell: (request) => request.staff || 'y/n',
      cellClassName: 'text-white'
    },
    {
      key: 'date_range',
      header: 'Date Range',
      renderCell: (request) => formatDateRange(request.start_date, request.end_date),
      cellClassName: 'text-gray-300'
    },
    {
      key: 'duration',
      header: 'Duration',
      renderCell: (request) => calculateDuration(request.start_date, request.end_date),
      cellClassName: 'text-gray-300'
    },
    {
      key: 'reason',
      header: 'Reason',
      cellClassName: 'text-gray-300'
    },
    {
      key: 'status',
      header: 'Status',
      renderCell: (request) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      )
    },
    {
      key: 'created_at',
      header: 'Requested On',
      renderCell: (request) => new Date(request.created_at).toLocaleDateString(),
      cellClassName: 'text-gray-300'
    },
    {
      key: 'actions',
      header: 'Actions',
      renderCell: (request) => (
        request.status.toLowerCase() === 'pending' ? (
          <button 
            onClick={() => handleResponseClick(request)}
            className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-1 px-3 rounded-md text-xs"
          >
            Respond
          </button>
        ) : null
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-white">Time Off Requests</h1>
            
            <div className="flex space-x-2">
              <button
                onClick={fetchTimeOffRequests}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
              >
                <Clock className="h-5 w-5 mr-2" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'All' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('All');
                setFilterStatus('All');
              }}
            >
              All Requests
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'Pending' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('Pending');
                setFilterStatus('Pending');
              }}
            >
              Pending
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'Approved' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('Approved');
                setFilterStatus('Approved');
              }}
            >
              Approved
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'Rejected' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('Rejected');
                setFilterStatus('Rejected');
              }}
            >
              Rejected
            </button>
          </div>

          <div className="bg-gray-800 rounded-md p-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by staff name or reason..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <Filter className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-amber-300 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <DataTable 
                columns={columns}
                data={filteredRequests}
                emptyMessage="No time off requests found matching your search criteria"
              />
            )}

            <div className="mt-4 text-gray-400 text-sm">
              Showing {filteredRequests.length} of {timeOffRequests.length} time off requests
            </div>
          </div>
        </main>
      </div>

      {/* Response Modal */}
      {responseModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-md max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Respond to Time Off Request</h3>
              <button
                onClick={() => setResponseModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gray-700 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Staff:</div>
                  <div className="text-white">{selectedRequest.staff?.fullname}</div>
                  
                  <div className="text-gray-400">Date Range:</div>
                  <div className="text-white">{formatDateRange(selectedRequest.start_date, selectedRequest.end_date)}</div>
                  
                  <div className="text-gray-400">Duration:</div>
                  <div className="text-white">{calculateDuration(selectedRequest.start_date, selectedRequest.end_date)}</div>
                  
                  <div className="text-gray-400">Reason:</div>
                  <div className="text-white">{selectedRequest.reason}</div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Response</label>
                <div className="flex space-x-3 mb-3">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      response.action === 'approve' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setResponse({ ...response, action: 'approve' })}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      response.action === 'reject' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setResponse({ ...response, action: 'reject' })}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Response Note (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-24"
                  placeholder="Add a note about your decision..."
                  value={response.note}
                  onChange={(e) => setResponse({ ...response, note: e.target.value })}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setResponseModalOpen(false)}
                  className="px-4 py-2 mr-2 text-gray-300 hover:text-white"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResponseSubmit}
                  disabled={!response.action || isProcessing}
                  className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-medium py-2 px-4 rounded-md flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>Submit Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOffRequestsPage;