import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <>
    

      {/* Dark AI Background */}
      <div
        className="relative min-h-screen flex flex-col justify-center items-center text-white px-4"
        style={{
          backgroundImage: "url('https://t3.ftcdn.net/jpg/03/23/83/00/240_F_323830067_Qd0gNLxdF4bu7PfsPpkJtVr0dBtnGKpX.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Hero Section */}
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)">
            Welcome to RAG Chatbot
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-200 drop-shadow-md">
            Ask questions, get answers, and explore knowledge instantly!  
            Login or Register to start your smart AI conversation.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link to="/login">
              <button className="w-48 sm:w-auto bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-600 hover:shadow-xl transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="w-48 sm:w-auto bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 hover:shadow-xl transition duration-300">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-gray-300 text-center max-w-md relative z-10 drop-shadow-sm">
          Transforming insurance queries into intelligent insights. Start exploring now!
        </p>
      </div>
    </>
  );
};

export default Home;
