"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // For now, just navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Register
        </h2>

        {/* Full Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full py-3 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition cursor-pointer"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
