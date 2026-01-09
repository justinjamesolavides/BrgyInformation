import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png"; // Put your logo in the 'public' folder

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        {/* Logo */}
        <div>
          <Image src={logo} alt="Brgy Logo" width={50} height={50} />
        </div>

        {/* Buttons */}
        <div>
          <Link href="/login">
            <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grows flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">
          Welcome to Brgy Information System
        </h1>
      </main>
    </div>
  );
};

export default Home;
