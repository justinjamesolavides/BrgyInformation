"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      setErrors({ general: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-4 relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
      </div>

      {/* Logo/Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 md:top-10 left-6 md:left-20 flex items-center gap-3 cursor-pointer group"
        onClick={() => router.push("/")}
      >
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
          <Image src="/Logo.png" alt="Barangay Logo" width={28} height={28} />
        </div>
        <span className="text-white font-bold text-xl md:text-2xl font-display group-hover:text-white/90 transition-colors">
          Brgy InfoSys
        </span>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="surface w-full max-w-md p-8 mt-20 md:mt-0 relative overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-neutral-900/95 border-2 border-white/20 dark:border-neutral-700/50"
      >
        {/* Success overlay */}
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-success-50 dark:bg-success-900/20 flex items-center justify-center z-10 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <FaCheckCircle className="text-success-500 text-5xl mx-auto mb-4" />
                <h3 className="text-success-800 dark:text-success-200 font-bold text-xl mb-2">
                  Login Successful!
                </h3>
                <p className="text-success-700 dark:text-success-300">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaUser className="text-primary-600 dark:text-primary-400 text-3xl" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3 font-display">
              Welcome Back
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Sign in to your account
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
            >
              <FaExclamationTriangle className="text-red-500 text-sm" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <FaUser className="text-lg" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input-field pl-12 pr-4 py-4 text-base ${
                  errors.email ? 'border-error-300 bg-error-50 dark:bg-error-900/20' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error-600 dark:text-error-400 text-sm mt-2 flex items-center gap-2"
              >
                <FaExclamationTriangle className="text-sm" />
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <FaLock className="text-lg" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`input-field pl-12 pr-14 py-4 text-base ${
                  errors.password ? 'border-error-300 bg-error-50 dark:bg-error-900/20' : ''
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error-600 dark:text-error-400 text-sm mt-2 flex items-center gap-2"
              >
                <FaExclamationTriangle className="text-sm" />
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="w-4 h-4 rounded border-2 border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-colors cursor-pointer"
                disabled={isLoading}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            className={`w-full py-4 font-bold rounded-2xl shadow-lg mb-6 transition-all duration-200 ${
              isLoading
                ? 'bg-primary-400 cursor-not-allowed shadow-primary-200'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-primary-500/25 hover:shadow-primary-500/40'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Signing in...</span>
              </div>
            ) : (
              <span className="text-lg">Sign In</span>
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-6"
        >
          <p className="text-neutral-600 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-warning-100 dark:bg-warning-900/50 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-warning-600 dark:text-warning-400 text-sm" />
            </div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Demo Credentials</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-600">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium text-neutral-900 dark:text-white">Email:</span> admin@brgy.com
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              <span className="font-medium text-neutral-900 dark:text-white">Password:</span> demo123
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
