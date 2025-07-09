import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    floor: 'all',
    search: '',
    sortBy: 'newest'
  });

  const categories = [
    'Clothing',
    'Electronics', 
    'Books',
    'Beauty',
    'Home & Garden',
    'Sports',
    'Toys',
    'Food',
    'Accessories',
    'Other'
  ];

  const floors = ['G', 'L1', 'L2', 'L3', 'L5'];

  useEffect(() => {
    fetchShops();
  }, [filters]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.floor !== 'all') {
        queryParams.append('floor', filters.floor);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.sortBy !== 'newest') {
        queryParams.append('sortBy', filters.sortBy);
      }

      const url = `http://localhost:3000/api/shops/public?${queryParams}`;
      console.log('Fetching shops from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Shops data received:', data);
        setShops(data.shops);
      } else {
        const errorData = await response.text();
        console.error('Error response:', response.status, errorData);
        toast.error(`Failed to load shops: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      floor: 'all', 
      search: '',
      sortBy: 'newest'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Our Shops</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover amazing stores across all floors of our shopping mall</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Shops
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by shop name..."
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Floor Filter */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor
              </label>
              <select
                id="floor"
                value={filters.floor}
                onChange={(e) => handleFilterChange('floor', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              >
                <option value="all">All Floors</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="category">Category</option>
                <option value="floor">Floor & Stall</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {shops.length} shop{shops.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors rounded-lg px-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No shops found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <Link 
                key={shop._id} 
                to={`/shop/${shop._id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                {/* Shop Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={shop.shopLogo && (shop.shopLogo.startsWith('data:') || shop.shopLogo.startsWith('http'))
                      ? shop.shopLogo
                      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNjBDODAgNjAgMjAgMTAwIDIwIDEwMFM4MDE0MCAxNTAgMTQwUzI4MCAxMDAgMjgwIDEwMFMyMjAgNjAgMTUwIDYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTUwIDEyMEMxNjIuNDI2IDEyMCAxNzIuNSAxMDkuOTI2IDE3Mi41IDk3LjVDMTcyLjUgODUuMDc0IDE2Mi40MjYgNzUgMTUwIDc1QzEzNy41NzQgNzUgMTI3LjUgODUuMDc0IDEyNy41IDk3LjVDMTI3LjUgMTA5LjkyNiAxMzcuNTc0IDEyMCAxNTAgMTIwWiIgZmlsbD0iIzYzNjk3NSIvPgo8dGV4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaG9wPC90ZXh0Pgo8L3N2Zz4K'
                    }
                    alt={shop.shopName}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNjBDODAgNjAgMjAgMTAwIDIwIDEwMFM4MCAxNDAgMTUwIDE0MFMyODAgMTAwIDI4MCAxMDBTMjIwIDYwIDE1MCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCAxMjBDMTYyLjQyNiAxMjAgMTcyLjUgMTA5LjkyNiAxNzIuNSA5Ny41QzE3Mi41IDg1LjA3NCAxNjIuNDI2IDc1IDE1MCA3NUMxMzcuNTc0IDc1IDEyNy41IDg1LjA3NCAxMjcuNSA5Ny41QzEyNy41IDEwOS45MjYgMTM3LjU3NCAxMjAgMTUwIDEyMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaG9wPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>

                {/* Shop Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {shop.shopName}
                    </h3>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full">
                      {shop.floorNumber}-{shop.stallNumber}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{shop.category}</p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {shop.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>By {shop.sellerId?.username}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      shop.isOpen 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    }`}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shops;