import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Handle scroll to top visibility
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 300);
    });
  }
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/shop" },
        { label: "New Arrivals", href: "/new-arrivals" },
        { label: "Featured", href: "/featured" },
        { label: "Discounts", href: "/discounts" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Terms & Conditions", href: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Github size={18} />, href: "https://github.com", label: "GitHub" },
    { icon: <Twitter size={18} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Instagram size={18} />, href: "https://instagram.com", label: "Instagram" }
  ];

  return (
    <>
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`${
          darkMode 
            ? "bg-gray-900/60 text-gray-100 border-gray-800/50" 
            : "bg-white/50 text-gray-800 border-gray-200/30"
        } backdrop-blur-lg border-t mt-auto`}
      >
        {/* Newsletter Section */}
        <div className={`border-b ${
          darkMode ? "border-gray-800/50" : "border-gray-200/30"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-md">
                <h3 className={`text-xl font-bold mb-2 ${
                  darkMode 
                    ? "bg-gradient-to-r from-blue-400 to-teal-400" 
                    : "bg-gradient-to-r from-blue-600 to-teal-500"
                } bg-clip-text text-transparent`}>
                  Subscribe to our newsletter
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Get the latest updates on new products and upcoming sales directly to your inbox.
                </p>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className={`px-4 py-2.5 rounded-full ${
                      darkMode
                        ? "bg-gray-800/70 text-gray-300 border border-gray-700/50 placeholder:text-gray-500"
                        : "bg-gray-100/70 text-gray-700 border border-gray-200/50 placeholder:text-gray-400"
                    } focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-blue-500/50" : "focus:ring-blue-500/30"
                    } min-w-[250px]`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-5 py-2.5 rounded-full font-medium ${
                      darkMode
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-colors`}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2">
                <ShoppingBag 
                  size={24} 
                  className={darkMode ? "text-blue-400" : "text-blue-600"} 
                />
                <span className={`text-xl font-bold ${
                  darkMode 
                    ? "bg-gradient-to-r from-blue-400 to-teal-400" 
                    : "bg-gradient-to-r from-blue-600 to-teal-500"
                } bg-clip-text text-transparent`}>
                  ShopElite
                </span>
              </Link>
              
              <p className={`mt-4 max-w-xs ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Discover premium products with modern design and exceptional quality for your everyday needs.
              </p>
              
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${
                      darkMode 
                        ? "bg-gray-800 text-gray-300 hover:text-blue-400" 
                        : "bg-gray-100 text-gray-600 hover:text-blue-600"
                    } transition-colors`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Links Columns */}
            {footerLinks.map((column, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-lg mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Link 
                          to={link.href}
                          className={`inline-flex items-center ${
                            darkMode 
                              ? "text-gray-300 hover:text-blue-400" 
                              : "text-gray-600 hover:text-blue-600"
                          } transition-colors`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Bottom Section */}
          <div className={`flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t ${
            darkMode ? "border-gray-800/50" : "border-gray-200/30"
          }`}>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              &copy; {new Date().getFullYear()} ShopElite. All rights reserved.
            </div>
            
            <div className="flex items-center mt-4 sm:mt-0">
              <motion.div 
                className={`flex items-center text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
                whileHover={{ color: darkMode ? "#60a5fa" : "#2563eb" }}
              >
                Made with <Heart size={14} className={`mx-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`} fill="currentColor" /> for quality shopping
              </motion.div>
              
              <span className={`mx-2 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>|</span>
              
              <motion.a 
                href="/privacy"
                className={`text-sm ${
                  darkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"
                } transition-colors flex items-center`}
                whileHover={{ x: 2 }}
              >
                Privacy Policy <ExternalLink size={12} className="ml-1" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
      
      {/* Scroll to top button */}
      <AnimatedScrollTopButton show={showScrollTop} onClick={scrollToTop} darkMode={darkMode} />
    </>
  );
};

// Animated Scroll to Top Button
const AnimatedScrollTopButton = ({ show, onClick, darkMode }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: show ? 1 : 0,
      scale: show ? 1 : 0.5,
      y: show ? 0 : 20
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`fixed bottom-8 right-8 p-3 rounded-full z-50 shadow-lg ${
      darkMode 
        ? "bg-blue-500 hover:bg-blue-600" 
        : "bg-blue-600 hover:bg-blue-700"
    } text-white transition-colors`}
    aria-label="Scroll to top"
  >
    <ChevronUp size={20} />
  </motion.button>
);

export default Footer;