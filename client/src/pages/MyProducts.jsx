import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Star, ArrowUpRight, Package, Loader, Trash2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const MyProducts = () => {
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let results = [];

      if (search.trim() !== '') {
        // 1. Try vector search (semantic)
        const vectorRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/search`, {
          params: { query: search }
        });
        results = vectorRes.data;

        // 2. Fallback to keyword search if vector search gives no results
        if (results.length === 0) {
          const keywordRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products`, {
            params: { search }
          });
          results = keywordRes.data;
        }
      } else {
        // 3. No search term → get all products
        const allRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products`);
        results = allRes.data;
      }

      setProducts(results);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setDeleteLoading(productId);
      
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`);
      
      if (response.status === 200) {
        // Remove the deleted product from the state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        setShowDeleteConfirm(null);
        
        // Optional: Show success message
        console.log('Product deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      // Optional: Show error message to user
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const confirmDelete = (product) => {
    setShowDeleteConfirm(product);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

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

  return (
    <div className={`min-h-screen py-20 px-6 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h2 className={`text-3xl font-bold mb-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 to-teal-400' 
              : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } bg-clip-text text-transparent`}>
            My Products
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Browse through your product collection or search for specific items
          </p>
          
          <div className="relative max-w-md">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              className={`w-full py-3 pl-12 pr-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                  : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                } backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
            />
            <Search className={`absolute left-4 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 border-4 ${
                darkMode ? 'border-blue-500' : 'border-blue-600'
              } border-t-transparent rounded-full`}
            />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className={`flex flex-col items-center justify-center h-64 text-center rounded-xl ${
              darkMode 
                ? 'bg-gray-800/60 border border-gray-700/50' 
                : 'bg-white/80 border border-gray-200/50'
              } backdrop-blur-xl shadow-lg p-6`}
          >
            <Package size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try a different search term or add some products
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6"
          >
            {products.map((product) => (
              <div key={product.id} className="relative group">
                {/* Delete Button */}
                <button
                  onClick={() => confirmDelete(product)}
                  disabled={deleteLoading === product.id}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
                    darkMode 
                      ? 'bg-red-600/80 hover:bg-red-600 text-white' 
                      : 'bg-red-500/80 hover:bg-red-500 text-white'
                    } opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="Delete Product"
                >
                  {deleteLoading === product.id ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
                
                <ProductCard 
                  product={product} 
                  variants={itemVariants} 
                  darkMode={darkMode}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-md w-full rounded-xl p-6 ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-500 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Delete Product</h3>
              </div>
              
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  disabled={deleteLoading === showDeleteConfirm.id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleteLoading === showDeleteConfirm.id ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MyProducts;