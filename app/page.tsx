"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers, FaFileAlt, FaClipboardList, FaStar, FaShieldAlt, FaRocket } from "react-icons/fa";

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">

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
              src="/BrgyLogo.png"
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

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 md:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Barangays Nationwide
            </h3>
            <p className="text-gray-600 text-lg">
              Join hundreds of barangays already using our system
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Barangays Served" },
              { number: "50K+", label: "Residents Managed" },
              { number: "100K+", label: "Requests Processed" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white px-6 md:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              What Barangay Leaders Say
            </h3>
            <p className="text-gray-600 text-lg">
              Real feedback from barangay officials using our system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Santos",
                position: "Barangay Captain",
                quote: "This system has revolutionized how we manage our barangay. So much easier and efficient!",
                rating: 5,
                avatar: "MS"
              },
              {
                name: "Juan Dela Cruz",
                position: "Barangay Secretary",
                quote: "The resident management and request processing features are fantastic. Highly recommended!",
                rating: 5,
                avatar: "JD"
              },
              {
                name: "Ana Garcia",
                position: "Barangay Treasurer",
                quote: "Reports are now generated in minutes instead of hours. Game changer for our barangay!",
                rating: 5,
                avatar: "AG"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <FaStar key={j} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.position}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 md:px-20 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-4xl font-bold mb-6">
              Ready to Modernize Your Barangay?
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of barangays already using our comprehensive information system.
              Start your digital transformation today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg text-lg"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg text-lg"
              >
                Login to Dashboard
              </motion.button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <FaShieldAlt />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRocket />
                <span>Fast Implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
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
