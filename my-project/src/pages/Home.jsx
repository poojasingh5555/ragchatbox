import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Dark AI Background */}
      <div
        className="relative min-h-screen flex flex-col justify-center items-center text-white px-4"
        style={{
          backgroundImage:
            "url('https://t3.ftcdn.net/jpg/03/23/83/00/240_F_323830067_Qd0gNLxdF4bu7PfsPpkJtVr0dBtnGKpX.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Hero Section */}
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            Welcome to RAG Chatbot
          </h1>

          <p className="text-lg sm:text-xl mb-8 text-gray-200 drop-shadow-md">
            Ask questions, get intelligent AI-powered answers instantly.
            Explore knowledge with smart Retrieval-Augmented Generation.
          </p>

          {/* Let’s Go Button */}
          <div className="flex justify-center mt-6">
            <Link to="/dashboard">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 
                                 text-white font-semibold px-8 py-3 rounded-xl 
                                 shadow-lg hover:scale-105 hover:shadow-2xl 
                                 transition duration-300">
                Let's Go
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-gray-300 text-center max-w-md relative z-10 drop-shadow-sm">
          Transforming queries into intelligent insights. Start exploring now!
        </p>
      </div>
    </>
  );
};

export default Home;