import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, DollarSign, Type, Image, Send, ArrowLeft, Loader, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Select from 'react-select';

const categories = [
  'Electronics','Books','Clothing','Accessories','Home','Toys','Sports','Beauty',
  'Furniture','Sound Systems','Speakers','Cooling Appliances','Kitchen Appliances',
  'Computers & Laptops','Mobile Phones','Wearable Technology','Gaming','Outdoor Equipment',
  'Office Supplies','Health & Personal Care','Automotive','Gardening','Baby Products',
  'Pet Supplies','Tools & Hardware','Lighting','Audio & Headphones','Cameras & Photography',
  'Smart Home Devices','Musical Instruments','Art & Craft Supplies','Food & Beverages',
  'Travel & Luggage','Jewelry','Watches','Footwear','Stationery','Safety & Security','Cleaning Supplies',
];

const EditProduct = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null,
    existingImage: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`);
        setProduct(res.data);
        
        // Check if category is in the predefined list
        const productCategory = res.data.category;
        const isCustom = productCategory && !categories.includes(productCategory);
        
        setForm({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description || '',
          category: isCustom ? '' : res.data.category || '',
          image: null,
          existingImage: res.data.image_url
        });
        
        if (isCustom) {
          setIsOtherCategory(true);
          setCustomCategory(res.data.category);
        }
        
        setImagePreview(res.data.image_url);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files[0]) {
        setForm(prev => ({ ...prev, image: files[0] }));
        setImagePreview(URL.createObjectURL(files[0]));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleCategorySelect = (opt) => {
    if (opt.value === 'other') {
      setIsOtherCategory(true);
      setForm(f => ({ ...f, category: '' }));
    } else {
      setIsOtherCategory(false);
      setForm(f => ({ ...f, category: opt.value }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the final category (either from the dropdown or the custom input)
    const finalCategory = isOtherCategory ? customCategory : form.category;
    
    // Validate required fields
    if (!form.name || !form.price || !finalCategory) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('category', finalCategory);
    
    if (form.image) {
      formData.append('image', form.image);
    } else if (form.existingImage) {
      formData.append('keepExistingImage', 'true');
    }

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate(`/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-20 px-6 flex justify-center items-center ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-12 h-12 border-4 ${
              darkMode ? 'border-blue-500' : 'border-blue-600'
            } border-t-transparent rounded-full`}
          />
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`min-h-screen py-20 px-6 flex flex-col justify-center items-center ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        <motion.div
          variants={itemVariants}
          className={`flex flex-col items-center justify-center text-center rounded-xl ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-gray-200/50'
            } backdrop-blur-xl shadow-lg p-12 max-w-lg w-full`}
        >
          <Package size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
          <h3 className="text-xl font-medium mb-3">Product not found</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            The product you're trying to edit might have been removed or is no longer available.
          </p>
          
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              } transition-colors`}
            >
              <ArrowLeft size={16} />
              Back to Products
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-6 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <Link to={`/view/${id}`}>
              <motion.div
                whileHover={{ x: -3 }}
                className={`flex items-center gap-1 ${
                  darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                } transition-colors`}
              >
                <ArrowLeft size={18} />
                <span>Back to product</span>
              </motion.div>
            </Link>
          </div>
          <h2 className={`text-3xl font-bold mt-6 mb-2 ${
            darkMode
              ? 'bg-gradient-to-r from-blue-400 to-teal-400'
              : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } bg-clip-text text-transparent`}>
            Edit Product
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Update the details of your product
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className={`rounded-xl ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-gray-200/50'
            } backdrop-blur-xl shadow-lg p-6`}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'
              } border ${darkMode ? 'border-red-800/50' : 'border-red-200'}`}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit}
            variants={formVariants}
            className="space-y-6"
          >
            {/* Product Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>
                <Type size={18} />
                <span className="ml-2">Product Name</span>
                <span className="text-blue-500 ml-1">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                    : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                  } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
              />
            </motion.div>

            {/* Price Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>
                <DollarSign size={18} />
                <span className="ml-2">Price (₹)</span>
                <span className="text-blue-500 ml-1">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                    : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                  } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
              />
            </motion.div>

            {/* Description Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>
                <Package size={18} />
                <span className="ml-2">Description</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                    : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                  } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
              />
            </motion.div>

            {/* Category Select */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>
                <Package size={18} />
                <span className="ml-2">Category</span>
                <span className="text-blue-500 ml-1">*</span>
              </label>
              <Select
                options={[
                  ...categories.map(c => ({ label: c, value: c })),
                  { label: 'Other (Please specify)', value: 'other' }
                ]}
                value={(() => {
                  if (isOtherCategory) return { label: 'Other (Please specify)', value: 'other' };
                  if (!form.category) return null;
                  return { label: form.category, value: form.category };
                })()}
                onChange={handleCategorySelect}
                placeholder="Select category..."
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    background: darkMode ? 'rgba(55,65,81,0.6)' : 'rgba(243,244,246,0.6)',
                    borderColor: darkMode ? '#4B5563' : '#D1D5DB',
                    padding: '6px'
                  }),
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused 
                      ? darkMode ? '#374151' : '#F3F4F6' 
                      : darkMode ? '#1F2937' : '#ffffff',
                    color: darkMode ? 'white' : 'black',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: darkMode ? 'white' : 'black',
                  })
                }}
              />
              {isOtherCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="Specify category"
                  required
                  className={`w-full mt-2 px-4 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                      : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                    } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
                />
              )}
            </motion.div>

            {/* Image Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>
                <Image size={18} />
                <span className="ml-2">Update Image</span>
              </label>
              <div className={`relative rounded-lg overflow-hidden ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
              } backdrop-blur-md`}>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className={`block w-full text-sm cursor-pointer file:mr-4 file:py-3 file:px-4 
                    file:rounded-none file:border-0 file:text-sm file:font-medium
                    ${darkMode
                      ? 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                      : 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                    } transition-all p-1`}
                />
                {form.existingImage && !form.image && (
                  <p className={`text-xs p-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current image will be used if no new image is selected
                  </p>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4 flex gap-4">
              <Link to={`/view/${id}`} className="flex-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 
                    ${darkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    } transition-all`}
                >
                  <span>Cancel</span>
                </motion.button>
              </Link>
              
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  isSuccess 
                    ? 'bg-green-600 text-white' 
                    : `${darkMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`
                } transition-all shadow-lg ${darkMode ? 'shadow-blue-500/10' : 'shadow-blue-500/20'}`}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : isSuccess ? (
                  <>
                    <Check size={18} />
                    <span>Product Updated!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Update Product</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>

        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`mt-8 rounded-xl ${
              darkMode 
                ? 'bg-gray-800/40 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
              } backdrop-blur-md p-4`}
          >
            <h3 className={`text-lg font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-3`}>Image Preview</h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-inner">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EditProduct;