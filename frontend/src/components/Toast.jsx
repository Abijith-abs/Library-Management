import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Define color schemes for different toast types
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  const iconStyles = {
    success: '✓',
    error: '✖',
    warning: '⚠️',
    info: 'ℹ️'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in ${typeStyles[type]}`}
    >
      <span className="mr-2 text-xl">{iconStyles[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={() => setIsVisible(false)} 
        className="ml-4 hover:bg-opacity-75 rounded-full p-1"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
