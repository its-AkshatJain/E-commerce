import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubmitProduct from './pages/SubmitProduct';
import MyProducts from './pages/MyProducts';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MyProducts />} />
        <Route path="/submit" element={<SubmitProduct />} />
        <Route path="/home" element={<MyProducts />} />
        <Route path="/view/:id" element={<ProductDetails />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
