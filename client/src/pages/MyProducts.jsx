import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Star, ArrowUpRight, Package, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products`, {
        params: { search }
      });
      setProducts(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
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
              <ProductCard 
                key={product.id} 
                product={product} 
                variants={itemVariants} 
                darkMode={darkMode}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const ProductCard = ({ product, variants, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-xl ${
        darkMode 
          ? 'bg-gray-800/60 border border-gray-700/50' 
          : 'bg-white/80 border border-gray-200/50'
        } backdrop-blur-xl shadow-lg`}
    >
      <div className="relative h-56 overflow-hidden rounded-t-xl">
        <motion.div
          className={`w-full h-full flex items-center justify-center ${
            darkMode
              ? 'bg-gradient-to-br from-blue-900/20 to-teal-800/20'
              : 'bg-gradient-to-br from-blue-100/50 to-teal-100/50'
          }`}
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {product.image_url ? (
            <img
              src={`${product.image_url}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-bold ${
            darkMode 
              ? 'text-white group-hover:text-blue-400'
              : 'text-gray-800 group-hover:text-blue-600'
            } transition-colors`}>
            {product.name}
          </h3>
          <div className={`flex items-center ${
            darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-600 text-white'
            } px-3 py-1 rounded-full text-sm font-medium`}>
            ₹{product.price}
          </div>
        </div>
        
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mb-4`}>
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} className="text-gray-400" />
          </div>
          
          <Link to={`/view/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-sm font-medium ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              View Details
            </motion.button>
          </Link>
          
        </div>
      </div>
      
      <motion.div 
        className={`absolute top-3 right-3 ${
          darkMode
            ? 'bg-gray-700/60 text-blue-400'
            : 'bg-white/60 text-blue-600'
          } backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100`}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ 
          rotate: isHovered ? 0 : -90,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUpRight size={18} />
      </motion.div>
    </motion.div>
  );
};

export default MyProducts;