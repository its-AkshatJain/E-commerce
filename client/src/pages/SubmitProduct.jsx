import { useState } from 'react';
import axios from 'axios';

const SubmitProduct = () => {
  const [form, setForm] = useState({ name: '', price: '', description: '', image_url: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', form);
      alert('Product submitted!');
      setForm({ name: '', price: '', description: '', image_url: '' });
    } catch (err) {
      console.error(err);
      alert('Error submitting product');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Submit New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="p-2 border" required />
        <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" className="p-2 border" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border" required />
        <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL (optional)" className="p-2 border" />
        <button type="submit" className="bg-blue-600 text-white py-2">Submit</button>
      </form>
    </div>
  );
};

export default SubmitProduct;
