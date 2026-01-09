import React from "react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="flex flex-col p-8 bg-white shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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

        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
