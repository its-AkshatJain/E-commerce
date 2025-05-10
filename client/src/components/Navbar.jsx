import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  Home, 
  Search, 
  Heart, 
  ShoppingCart, 
  Settings
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll effect for glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/home", label: "Home", icon: <Home size={18} /> },
    { to: "/submit", label: "Add Products", icon: <ShoppingBag size={18} /> },
    { to: "/wishlist", label: "Wishlist", icon: <Heart size={18} /> },
    { to: "/cart", label: "Cart", icon: <ShoppingCart size={18} /> },
    { to: "/account", label: "Account", icon: <User size={18} /> },
  ];

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-xl shadow-lg border-b" 
          : "backdrop-blur-md"
      } ${
        darkMode 
          ? "bg-gray-900/60 text-gray-100 border-gray-800/50" 
          : "bg-white/50 text-gray-800 border-gray-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <ShoppingBag 
                size={24} 
                className={darkMode ? "text-blue-400" : "text-blue-600"} 
              />
              <span className={`ml-2 text-xl font-bold ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-400 to-teal-400" 
                  : "bg-gradient-to-r from-blue-600 to-teal-500"
              } bg-clip-text text-transparent`}>
                ShopElite
              </span>
            </motion.div>
          </Link>

          {/* Search bar - desktop only
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className={`flex items-center w-full rounded-full px-3 py-2 ${
              darkMode 
                ? "bg-gray-800/70 text-gray-300 border border-gray-700/50" 
                : "bg-gray-100/70 text-gray-700 border border-gray-200/50"
            }`}>
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className={`ml-2 outline-none w-full bg-transparent ${
                  darkMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400"
                }`}
              />
            </div>
          </div> */}

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full ${
                      isActive 
                        ? darkMode 
                          ? "bg-blue-500/20 text-blue-400" 
                          : "bg-blue-500/10 text-blue-600" 
                        : darkMode 
                          ? "text-gray-300 hover:text-blue-400 hover:bg-gray-800/60" 
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60"
                    } transition-all duration-200`}
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Dark/Light mode toggle */}
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-gray-800/80 text-yellow-300 hover:bg-gray-700/80" 
                  : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/cart">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-full ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  3
                </span>
              </motion.div>
            </Link>
            
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-gray-800/80 text-yellow-300" 
                  : "bg-gray-100/80 text-gray-700"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className={`p-2 rounded-full ${
                darkMode ? "bg-gray-800/80" : "bg-gray-100/80"
              }`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className={`md:hidden ${
              darkMode 
                ? "bg-gray-900/95 text-gray-100 border-t border-gray-800/50" 
                : "bg-white/95 text-gray-800 border-t border-gray-200/30"
            } backdrop-blur-xl`}
          >
            {/* Mobile search */}
            <div className="p-4">
              {/* <div className={`flex items-center w-full rounded-full px-3 py-2 ${
                darkMode 
                  ? "bg-gray-800/70 text-gray-300 border border-gray-700/50" 
                  : "bg-gray-100/70 text-gray-700 border border-gray-200/50"
              }`}>
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`ml-2 outline-none w-full bg-transparent ${
                    darkMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400"
                  }`}
                />
              </div> */}
            </div>
            
            {/* Mobile links */}
            <div className="px-4 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    whileHover={{ x: 5 }}
                    className="py-1"
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        isActive 
                          ? darkMode 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "bg-blue-500/10 text-blue-600" 
                          : darkMode 
                            ? "text-gray-300 hover:text-blue-400" 
                            : "text-gray-700 hover:text-blue-600"
                      } transition-colors duration-200`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Settings in mobile menu */}
              <motion.div
                whileHover={{ x: 5 }}
                className="py-1 pt-4 border-t border-gray-200/20"
              >
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    darkMode 
                      ? "text-gray-300 hover:text-blue-400" 
                      : "text-gray-700 hover:text-blue-600"
                  } transition-colors`}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}