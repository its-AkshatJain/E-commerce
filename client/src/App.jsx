import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubmitProduct from './pages/SubmitProduct';
import MyProducts from './pages/MyProducts';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/submit" element={<SubmitProduct />} />
        <Route path="/products" element={<MyProducts />} />
        <Route path="*" element={<Navigate to="/submit" />} />
      </Routes>
    </Router>
  );
}

export default App;
