import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, DollarSign, Type, Image, Send, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SubmitProduct = () => {
  const { darkMode } = useTheme();
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.price || !form.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsSuccess(true);

      setTimeout(() => {
        setForm({ name: '', price: '', description: '' });
        setImageFile(null);
        setImagePreview(null);
        setIsSubmitting(false);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError('Error submitting product. Please try again.');
    }
  };

  const formControls = [
    {
      name: 'name',
      label: 'Product Name',
      placeholder: 'Enter product name',
      type: 'text',
      required: true,
      icon: <Type size={18} />
    },
    {
      name: 'price',
      label: 'Price (₹)',
      placeholder: 'Enter price',
      type: 'number',
      required: true,
      icon: <DollarSign size={18} />
    },
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Describe your product',
      type: 'textarea',
      required: true,
      icon: <Package size={18} />
    },
    {
      name: 'image',
      label: 'Upload Image',
      type: 'file',
      required: false,
      icon: <Image size={18} />
    }
  ];

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
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
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h2 className={`text-3xl font-bold mb-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 to-teal-400' 
              : 'bg-gradient-to-r from-blue-600 to-teal-500'
            } bg-clip-text text-transparent`}>
            Submit New Product
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Fill in the details below to add a new product to your collection
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
            {formControls.map((control) => (
              <motion.div key={control.name} variants={itemVariants} className="space-y-2">
                <label className={`flex items-center ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } font-medium mb-1`}>
                  {control.icon}
                  <span className="ml-2">{control.label}</span>
                  {control.required && <span className="text-blue-500 ml-1">*</span>}
                </label>

                {control.type === 'textarea' ? (
                  <textarea
                    name={control.name}
                    value={form[control.name]}
                    onChange={handleChange}
                    placeholder={control.placeholder}
                    required={control.required}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                        : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                      } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
                  />
                ) : control.type === 'file' ? (
                  <div className={`relative rounded-lg overflow-hidden ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                  } backdrop-blur-md`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`block w-full text-sm cursor-pointer file:mr-4 file:py-3 file:px-4 
                        file:rounded-none file:border-0 file:text-sm file:font-medium
                        ${darkMode
                          ? 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                          : 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                        } transition-all p-1`}
                    />
                  </div>
                ) : (
                  <input
                    name={control.name}
                    type={control.type}
                    value={form[control.name]}
                    onChange={handleChange}
                    placeholder={control.placeholder}
                    required={control.required}
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700/60 text-white placeholder-gray-400 border-gray-600/50 focus:border-blue-500' 
                        : 'bg-gray-100/60 text-gray-900 placeholder-gray-500 border-gray-200/50 focus:border-blue-500'
                      } border backdrop-blur-md focus:ring-2 focus:ring-blue-500/30 outline-none transition-all`}
                  />
                )}
              </motion.div>
            ))}

            <motion.div 
              variants={itemVariants}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 ${
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
                    <span>Product Submitted!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Product</span>
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

export default SubmitProduct;