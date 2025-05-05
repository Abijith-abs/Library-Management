import React from 'react';
import footerLogo from '../assets/footer-logo.png';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Logo & Navigation */}
        <div>
          <img src={footerLogo} alt="Logo" className="mb-4 w-36" />
          <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#about" className="hover:text-white">About Us</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Subscribe to Our Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">
            Get the latest updates, news, and exclusive offers directly in your inbox.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-[#b5b8ce] w-full px-4 py-2 rounded-l-md text-black focus:outline-none"
            />
            <button className="bg-blue-600 px-6 py-2 rounded-r-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Media & Legal Links */}
        <div className="flex flex-col items-start lg:items-end">
          <ul className="flex gap-6 text-sm text-gray-400 mb-4">
            <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
          </ul>
          <div className="flex gap-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
