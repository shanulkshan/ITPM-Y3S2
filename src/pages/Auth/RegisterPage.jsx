import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Seller-specific fields
    shopName: "",
    category: "",
    stallNumber: "",
    floorNumber: "",
    description: "",
    shopLogo: null
  });
  
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: "", label: "Select Category" },
    { value: "Cloth", label: "Clothing & Fashion" },
    { value: "Beauty", label: "Beauty & Cosmetics" },
    { value: "Book", label: "Books & Stationery" },
    { value: "Food", label: "Food & Beverages" },
    { value: "Tech", label: "Technology & Electronics" },
    { value: "Other", label: "Other" }
  ];

  const floors = [
    { value: "", label: "Select Floor" },
    { value: "G", label: "Ground Floor (G)" },
    { value: "L1", label: "Level 1 (L1)" },
    { value: "L2", label: "Level 2 (L2)" },
    { value: "L3", label: "Level 3 (L3)" },
    { value: "L5", label: "Level 5 (L5)" }
  ];

  // Generate stall numbers based on selected floor
  const getStallNumbers = (floorCode) => {
    if (!floorCode) return [{ value: "", label: "Select Floor First" }];
    
    const stalls = [{ value: "", label: "Select Stall" }];
    for (let i = 1; i <= 10; i++) {
      const stallNumber = `${floorCode}-${i.toString().padStart(2, '0')}`;
      stalls.push({ value: stallNumber, label: stallNumber });
    }
    return stalls;
  };

  const availableStalls = getStallNumbers(formData.floorNumber);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts and unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Reset seller fields when switching to customer
  useEffect(() => {
    if (userType === 'customer') {
      setFormData(prev => ({
        ...prev,
        shopName: "",
        category: "",
        stallNumber: "",
        floorNumber: "",
        description: "",
        shopLogo: null
      }));
    }
  }, [userType]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        // Reset stall number when floor changes
        if (name === 'floorNumber') {
          newData.stallNumber = '';
        }
        
        return newData;
      });
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    // Validate seller-specific fields
    if (userType === 'seller') {
      if (!formData.shopName || !formData.category || !formData.stallNumber || 
          !formData.floorNumber || !formData.description) {
        toast.error("Please fill in all shop details");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submitData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      userType
    };

    // Add seller-specific data
    if (userType === 'seller') {
      submitData.shopName = formData.shopName;
      submitData.category = formData.category;
      submitData.stallNumber = formData.stallNumber;
      submitData.floorNumber = formData.floorNumber;
      submitData.description = formData.description;
      
      // Convert shop logo to base64 if provided
      if (formData.shopLogo) {
        submitData.shopLogo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.shopLogo);
        });
      } else {
        submitData.shopLogo = '';
      }
    }

    const result = await register(submitData);
    
    if (result.success) {
      toast.success(userType === 'seller' ? 
        "Seller registration successful! Your shop is pending approval. Please login." : 
        "Registration successful! Please login."
      );
      navigate("/login");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Create Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
              Register as
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Customer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="seller"
                  checked={userType === 'seller'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Shop Owner</span>
              </label>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Fields */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Seller-specific fields */}
            {userType === 'seller' && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="shopName" className="block text-sm font-medium leading-6 text-gray-900">
                        Shop Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="shopName"
                          name="shopName"
                          type="text"
                          required={userType === 'seller'}
                          value={formData.shopName}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Enter your shop name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Category
                      </label>
                      <div className="mt-2">
                        <select
                          id="category"
                          name="category"
                          required={userType === 'seller'}
                          value={formData.category}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="floorNumber" className="block text-sm font-medium leading-6 text-gray-900">
                          Floor Number
                        </label>
                        <div className="mt-2">
                          <select
                            id="floorNumber"
                            name="floorNumber"
                            required={userType === 'seller'}
                            value={formData.floorNumber}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            {floors.map(floor => (
                              <option key={floor.value} value={floor.value}>{floor.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="stallNumber" className="block text-sm font-medium leading-6 text-gray-900">
                          Stall Number
                        </label>
                        <div className="mt-2">
                          <select
                            id="stallNumber"
                            name="stallNumber"
                            required={userType === 'seller'}
                            value={formData.stallNumber}
                            onChange={handleChange}
                            disabled={!formData.floorNumber}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            {availableStalls.map(stall => (
                              <option key={stall.value} value={stall.value}>{stall.label}</option>
                            ))}
                          </select>
                        </div>
                        {!formData.floorNumber && (
                          <p className="mt-1 text-xs text-gray-500">Please select a floor first</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Shop Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          required={userType === 'seller'}
                          value={formData.description}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Describe your shop and what you sell..."
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="shopLogo" className="block text-sm font-medium leading-6 text-gray-900">
                        Shop Logo
                      </label>
                      <div className="mt-2">
                        <input
                          id="shopLogo"
                          name="shopLogo"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">Upload a logo for your shop (optional)</p>
                        
                        {/* Logo Preview */}
                        {formData.shopLogo && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                            <img
                              src={URL.createObjectURL(formData.shopLogo)}
                              alt="Shop logo preview"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-sm text-center text-red-600">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    {userType === 'seller' ? 'Creating shop...' : 'Creating account...'}
                  </div>
                ) : (
                  userType === 'seller' ? 'Register as Seller' : 'Register'
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;