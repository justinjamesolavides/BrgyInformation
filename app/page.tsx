"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers, FaFileAlt, FaClipboardList } from "react-icons/fa";

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col">

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-lg"
      >
        <div className="flex justify-between items-center px-6 md:px-20 py-4">
          <h1 className="text-white font-bold text-lg tracking-wide">
            Brgy InfoSys
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transition cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between flex-grow px-6 md:px-20 pt-32 gap-12">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Barangay <br /> Information System
          </h2>

          <p className="text-white/90 text-lg mb-8 max-w-xl">
            Manage residents, requests, and reports efficiently.
            A modern system built for your barangay.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-lg"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Logo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="md:w-1/2 flex justify-center"
        >
          <div className="bg-white/90 p-10 rounded-3xl shadow-2xl backdrop-blur-lg flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Barangay Logo"
              width={220}
              height={220}
              className="mb-4"
              priority
            />

            <h3 className="text-gray-800 font-bold text-lg tracking-wide text-center">
              Barangay Information System
            </h3>

            <p className="text-gray-500 text-sm text-center mt-1">
              Official Management Platform
            </p>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-white rounded-t-[3rem] -mt-24 px-6 md:px-20 py-20 shadow-xl">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-14">
          Main Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaUsers />,
              title: "Residents",
              desc: "Store and manage complete resident records.",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: <FaFileAlt />,
              title: "Requests",
              desc: "Process clearances and certificates faster.",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: <FaClipboardList />,
              title: "Reports",
              desc: "Generate accurate barangay reports.",
              color: "bg-yellow-100 text-yellow-600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${item.color}`}>
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-white/80 text-sm">
        © {new Date().getFullYear()} Brgy Information System. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
