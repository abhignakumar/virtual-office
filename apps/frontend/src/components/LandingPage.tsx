import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-300 flex flex-col">
      <NavBar />
      <div className="flex flex-col items-center justify-center text-center py-24 px-6 sm:px-12 lg:px-24">
        <h1 className="text-4xl font-semibold text-gray-900 mb-6 max-w-3xl leading-tight">
          Create Your Virtual Office and Connect with Colleagues Worldwide
        </h1>
        <h2 className="text-xl font-medium text-gray-600 mb-8 max-w-2xl">
          Start your journey by creating your office space and collaborating
          from anywhere!
        </h2>

        <Button asChild className="group mt-6">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
          >
            <ArrowRight className="group-hover:translate-x-1 transition-all mr-3 w-5 h-5" />
            Get Started
          </Link>
        </Button>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4 sm:px-12 md:px-24">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Seamless Collaboration
            </h3>
            <p className="text-gray-600">
              Work together, share ideas, and manage projects effortlessly, no
              matter where you are.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Easy Setup
            </h3>
            <p className="text-gray-600">
              Get started in no time with an intuitive setup process, no
              technical skills required.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Global Connectivity
            </h3>
            <p className="text-gray-600">
              Connect with team members around the world and build your dream
              workspace with ease.
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative w-full bg-cover bg-center bg-no-repeat h-[400px]"
        style={{ backgroundImage: 'url("/images/virtual-office-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-3xl font-semibold text-center px-6 md:px-12">
            Revolutionize the Way You Work - Build a Virtual Office Now!
          </h3>
        </div>
      </div>

      <footer className="w-full py-8 bg-gray-900 text-center text-gray-100">
        <p className="text-sm">
          &copy; 2025 Virtual Office. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
