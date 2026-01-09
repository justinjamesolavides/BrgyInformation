"use client"
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Next.js 13 App Router
import { FaUsers, FaFileAlt, FaClipboardList } from "react-icons/fa";

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col">

      {/* Header */}
      <header className="flex justify-end p-6 bg-white/20 backdrop-blur-md">
        <button
          onClick={() => router.push("/login")}
          className="mr-4 px-5 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="px-5 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition cursor-pointer"
        >
          Register
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-6 md:px-20 mt-10">

        {/* Left Content */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-6">
            Welcome to Brgy Information System
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Manage residents, requests, and reports efficiently. Your barangay at your fingertips.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <button
              onClick={() => router.push("/login")} // Get Started goes to login
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer">
              Get Started
              </button>
         </div>
         </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/barangay-illustration.png" // replace with your image
            alt="Brgy Illustration"
            width={400}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-white rounded-t-3xl -mt-20 shadow-xl p-10 md:p-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Main Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Residents Card */}
          <div className="bg-blue-50 p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transform transition">
            <FaUsers className="text-blue-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Residents</h3>
            <p className="text-gray-600">View, add, and manage all barangay residents easily.</p>
          </div>

          {/* Requests Card */}
          <div className="bg-green-50 p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transform transition">
            <FaFileAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Requests</h3>
            <p className="text-gray-600">Handle all resident requests: clearance, certificates, and more.</p>
          </div>

          {/* Reports Card */}
          <div className="bg-yellow-50 p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transform transition">
            <FaClipboardList className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reports</h3>
            <p className="text-gray-600">Generate detailed reports for residents and requests.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-white/80 mt-10">
        &copy; {new Date().getFullYear()} Brgy Information System. All rights reserved.
      </footer>

    </div>
  );
};

export default HomePage;
