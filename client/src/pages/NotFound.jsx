import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`max-w-lg w-full ${
          darkMode 
            ? 'bg-gray-800/60 border border-gray-700/50' 
            : 'bg-white/80 border border-gray-200/50'
        } backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                darkMode 
                  ? 'bg-gray-700/60 text-blue-400' 
                  : 'bg-blue-100/60 text-blue-600'
              }`}
            >
              <FolderOpen size={48} />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={`text-3xl font-bold text-center mb-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-400 to-teal-400' 
                : 'bg-gradient-to-r from-blue-600 to-teal-500'
              } bg-clip-text text-transparent`}>
              Page Not Found
            </h1>
            
            <p className={`text-center mb-8 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/" className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors shadow-lg shadow-blue-500/20 w-full`}>
                <Home size={18} />
                <span>Go Home</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/shop" className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors w-full`}>
                <ShoppingBag size={18} />
                <span>View Products</span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`py-4 px-8 ${
            darkMode ? 'bg-gray-700/60' : 'bg-gray-100/60'
          } backdrop-blur-md`}
        >
          <Link to="/" className={`flex items-center gap-2 text-sm ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          } hover:underline`}>
            <ArrowLeft size={16} />
            <span>Return to homepage</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;