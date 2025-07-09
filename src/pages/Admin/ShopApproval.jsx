import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ShopApproval = () => {
  const [pendingShops, setPendingShops] = useState([]);
  const [approvedShops, setApprovedShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    shopId: null,
    reason: ''
  });

  useEffect(() => {
    fetchShops();
  }, [activeTab]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Use the correct admin endpoints
      const endpoint = activeTab === 'pending' ? '/api/shops/admin/pending' : '/api/shops/admin/approved';
      const fullUrl = `http://localhost:3000${endpoint}`;
      
      console.log('Fetching from:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        if (activeTab === 'pending') {
          setPendingShops(data.shops || []);
        } else {
          setApprovedShops(data.shops || []);
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch shops: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error(`Failed to fetch shops: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveShop = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/admin/approve/${shopId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Shop approved successfully');
        fetchShops();
      } else {
        throw new Error('Failed to approve shop');
      }
    } catch (error) {
      console.error('Error approving shop:', error);
      toast.error('Failed to approve shop');
    }
  };

  const handleRejectShop = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/admin/reject/${rejectModal.shopId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectModal.reason }),
      });

      if (response.ok) {
        toast.success('Shop rejected successfully');
        setRejectModal({ isOpen: false, shopId: null, reason: '' });
        fetchShops();
      } else {
        throw new Error('Failed to reject shop');
      }
    } catch (error) {
      console.error('Error rejecting shop:', error);
      toast.error('Failed to reject shop');
    }
  };

  const openRejectModal = (shopId) => {
    setRejectModal({ isOpen: true, shopId, reason: '' });
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, shopId: null, reason: '' });
  };

  const ShopCard = ({ shop, isPending }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{shop.shopName}</h3>
          <p className="text-sm text-gray-600">by {shop.sellerId?.username}</p>
          <p className="text-sm text-gray-500">{shop.sellerId?.email}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {shop.category}
          </span>
          <p className="text-sm text-gray-600 mt-1">
            Floor: {shop.floorNumber} | Stall: {shop.stallNumber}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">{shop.description}</p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Applied: {new Date(shop.createdAt).toLocaleDateString()}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          shop.isApproved 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {shop.isApproved ? 'Approved' : 'Pending'}
        </span>
      </div>

      {isPending && (
        <div className="flex space-x-3">
          <button
            onClick={() => handleApproveShop(shop._id)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => openRejectModal(shop._id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      )}

      {shop.rejectionReason && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Rejection Reason:</strong> {shop.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Shop Approval Management</h1>
            <p className="text-gray-600">Review and approve shop registration requests</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Approval ({pendingShops.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved Shops ({approvedShops.length})
              </button>
            </nav>
          </div>

          {/* Shop List */}
          <div className="p-6">
            {activeTab === 'pending' ? (
              pendingShops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-500">All shop requests have been reviewed.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingShops.map((shop) => (
                    <ShopCard key={shop._id} shop={shop} isPending={true} />
                  ))}
                </div>
              )
            ) : (
              approvedShops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approved shops</h3>
                  <p className="text-gray-500">No shops have been approved yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {approvedShops.map((shop) => (
                    <ShopCard key={shop._id} shop={shop} isPending={false} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Shop Application</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection:
                </label>
                <textarea
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  placeholder="Please provide a reason for rejecting this shop application..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectShop}
                  disabled={!rejectModal.reason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopApproval;
