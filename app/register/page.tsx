import React from "react";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="flex flex-col p-8 bg-white shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Register</h2>

        <input
        type="text"
        placeholder="Full Name"
        className="mb-4 p-2 border-2 border-black rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-4 p-2 border rounded"
        />

        <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Register
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
