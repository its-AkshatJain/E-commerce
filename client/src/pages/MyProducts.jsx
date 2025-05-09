import { useEffect, useState } from 'react';
import axios from 'axios';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products`, {
        params: { search } // Pass the search term as query param
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]); // Fetch products whenever the search term changes

  const handleSearch = (e) => {
    setSearch(e.target.value); // Update search term
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Products</h2>
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search products by context..."
        className="border p-2 w-full max-w-md mb-4"
      />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <img
              src={product.image_url || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">₹ {product.price}</p>
            <p className="text-sm mt-1">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
