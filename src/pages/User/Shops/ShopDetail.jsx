import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShopDetail = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopDetails();
    fetchShopItems();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/${shopId}`);
      
      if (response.ok) {
        const data = await response.json();
        setShop(data.shop);
      } else {
        toast.error('Shop not found');
      }
    } catch (error) {
      toast.error('Failed to load shop details');
    }
  };

  const fetchShopItems = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/item/shop/${shopId}`);
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load shop items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop not found</h1>
          <Link to="/shops" className="text-indigo-600 hover:text-indigo-800">
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/shops" className="hover:text-indigo-600">Shops</Link>
            </li>
            <li>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900">{shop.shopName}</li>
          </ol>
        </nav>

        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={shop.shopLogo && (shop.shopLogo.startsWith('data:') || shop.shopLogo.startsWith('http'))
                  ? shop.shopLogo
                  : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBDNjggOTAgOCAxNTAgOCAxNTBTNjggMjEwIDE1MCAyMTBTMjkyIDE1MCAyOTIgMTUwUzIzMiA5MCAxNTAgOTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTcyLjVDMTYyLjQyNiAxNzIuNSAxNzIuNSAxNjIuNDI2IDE3Mi41IDE1MEMxNzIuNSAxMzcuNTc0IDE2Mi40MjYgMTI3LjUgMTUwIDEyNy41QzEzNy41NzQgMTI3LjUgMTI3LjUgMTM3LjU3NCAxMjcuNSAxNTBDMTI3LjUgMTYyLjQyNiAxMzcuNTc0IDE3Mi41IDE5MCAxNzIuNVoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaG9wPC90ZXh0Pgo8L3N2Zz4K'
                }
                alt={shop.shopName}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBDNjggOTAgOCAxNTAgOCAxNTBTNjggMjEwIDE1MCAyMTBTMjkyIDE1MCAyOTIgMTUwUzIzMiA5MCAxNTAgOTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTcyLjVDMTYyLjQyNiAxNzIuNSAxNzIuNSAxNjIuNDI2IDE3Mi41IDE1MEMxNzIuNSAxMzcuNTc0IDE2Mi40MjYgMTI3LjUgMTUwIDEyNy41QzEzNy41NzQgMTI3LjUgMTI3LjUgMTM3LjU3NCAxMjcuNSAxNTBDMTI3LjUgMTYyLjQyNiAxMzcuNTc0IDE3Mi41IDE1MCAxNzIuNVoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaG9wPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{shop.shopName}</h1>
                  <p className="text-gray-600">{shop.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="text-lg font-semibold text-indigo-600">
                    Floor {shop.floorNumber}, Stall {shop.stallNumber}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{shop.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Owned by {shop.sellerId?.username}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  shop.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {shop.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Products</h2>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600">This shop hasn't added any products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <img
                      src={item.images && item.images[0] && (item.images[0].startsWith('data:') || item.images[0].startsWith('http'))
                        ? item.images[0]
                        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDNTAgNDAgMTAgODAgMTAgODBTNTAgMTIwIDEwMCAxMjBTMTkwIDgwIDE5MCA4MFMxNTAgNDAgMTAwIDQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTAuNDU3IDEwMCAxMTkgOTEuNDU3IDExOSA4MUMxMTkgNzAuNTQzIDExMC40NTcgNjIgMTAwIDYyQzg5LjU0MyA2MiA4MSA3MC41NDMgODEgODFDODEgOTEuNDU3IDg5LjU0MyAxMDAgMTAwIDEwMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K'
                      }
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDNTAgNDAgMTAgODAgMTAgODBTNTAgMTIwIDEwMCAxMjBTMTkwIDgwIDE5MCA4MFMxNTAgNDAgMTAwIDQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTAuNDU3IDEwMCAxMTkgOTEuNDU3IDExOSA4MUMxMTkgNzAuNTQzIDExMC40NTcgNjIgMTAwIDYyQzg5LjU0MyA2MiA4MSA3MC41NDMgODEgODFDODEgOTEuNDU3IDg5LjU0MyAxMDAgMTAwIDEwMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price}
                        {item.discount > 0 && (
                          <span className="ml-2 text-sm text-red-600">
                            ({item.discount}% off)
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
