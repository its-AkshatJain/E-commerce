import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader, Package, Star, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ProductDetails = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
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

  if (!product) {
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
            The product you're looking for might have been removed or is no longer available.
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
        className="max-w-4xl mx-auto"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex items-center"
        >
          <Link to="/">
            <motion.div
              whileHover={{ x: -3 }}
              className={`flex items-center gap-1 ${
                darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
              } transition-colors`}
            >
              <ArrowLeft size={18} />
              <span>Back to products</span>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`rounded-xl overflow-hidden ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-gray-200/50'
            } backdrop-blur-xl shadow-lg`}
        >
          {/* Product Hero Section */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className={`w-full h-full flex items-center justify-center ${
              darkMode
                ? 'bg-gradient-to-br from-blue-900/20 to-teal-800/20'
                : 'bg-gradient-to-br from-blue-100/50 to-teal-100/50'
            }`}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.appendChild(
                      Object.assign(document.createElement('div'), {
                        className: 'flex items-center justify-center w-full h-full',
                        innerHTML: `<div class="${darkMode ? 'text-gray-600' : 'text-gray-400'}"><svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>`
                      })
                    );
                  }}
                />
              ) : (
                <Package className={`w-24 h-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="absolute bottom-4 right-4">
              <div className={`flex items-center ${
                darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                } px-4 py-2 rounded-full text-lg font-medium`}>
                ₹{product.price}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8">
            <motion.h1 
              variants={itemVariants}
              className={`text-3xl font-bold mb-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-400 to-teal-400' 
                  : 'bg-gradient-to-r from-blue-600 to-teal-500'
                } bg-clip-text text-transparent`}
            >
              {product.name}
            </motion.h1>

            <motion.div 
              variants={itemVariants}
              className="flex items-center text-yellow-500 mb-4"
            >
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} className="text-gray-400" />
              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                4.0 (12 reviews)
              </span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`mb-6 p-4 rounded-lg ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100/60'
              }`}
            >
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Description
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {product.description || "No description available for this product."}
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link to="/" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  } transition-colors`}
                >
                  Back to Products
                </motion.button>
              </Link>
              
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium ${
                  darkMode 
                    ? 'border border-blue-500 text-blue-400 hover:bg-blue-900/20' 
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                } transition-colors`}
              >
                Edit Product
              </motion.button> */}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;