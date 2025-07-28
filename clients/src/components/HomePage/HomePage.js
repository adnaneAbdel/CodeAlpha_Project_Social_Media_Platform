import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MiniSocial</h1>
        <nav className="space-x-4">
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
          <a href="/register" className="text-white bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-20 mb-6">
          Connect. Share. Grow.
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Welcome to <span className="text-blue-600 font-semibold">MiniSocial</span> – a simple, fun, and secure way to connect with friends, share updates, and express yourself freely.
        </p>
        <a
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Join Now — It’s Free!
        </a>
        <img
          src="https://eternitymarketing.com/assets/image-cache/john_schnobrich_2FPjlAyMQTA_unsplash.034ba3c3.jpg"
          alt="Social Media"
          className="w-full max-w-3xl mt-12 rounded-xl shadow-md"
        />
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm p-4 mt-12">
        © {new Date().getFullYear()} MiniSocial. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
