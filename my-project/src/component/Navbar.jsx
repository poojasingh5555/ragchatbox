import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      <h2 className="text-xl font-bold">My App</h2>

      <div className="space-x-6">
        <Link 
          to="/" 
          className="hover:text-yellow-300 transition duration-200"
        >
          Home
        </Link>

        

     
        <Link 
          to="/dashboard" 
          className="hover:text-yellow-300 transition duration-200"
        >
          Dashboard
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
