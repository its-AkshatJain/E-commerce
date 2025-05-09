import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Mini E-Commerce</h1>
      <div className="flex gap-4">
        <Link
          to="/submit"
          className={pathname === '/submit' ? 'font-semibold underline' : ''}
        >
          Submit Product
        </Link>
        <Link
          to="/products"
          className={pathname === '/products' ? 'font-semibold underline' : ''}
        >
          My Products
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
