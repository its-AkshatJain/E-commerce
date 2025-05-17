import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default ProductCard;
